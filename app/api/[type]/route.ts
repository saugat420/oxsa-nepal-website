import { createSign } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { siteConfig } from "@/src/config/site";
import { animals } from "@/src/content/data";

const base = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(30),
  website: z.string().max(0).optional(),
}).passthrough();

const sponsorSchema = base.extend({
  animal: z.string().trim().min(1).max(80),
  contribution: z.enum(["1000", "2000", "3000", "4000", "5000", "custom"]),
  customContribution: z.string().trim().max(12).optional(),
  message: z.string().trim().max(1000).optional(),
});

const contactSchema = base.extend({
  subject: z.string().trim().min(1).max(100),
  message: z.string().trim().min(2).max(2000),
});

const recent = new Map<string, { count: number; reset: number }>();

export const runtime = "nodejs";

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawPrivateKey) throw new Error("Google Sheets credentials are missing.");

  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = encodeBase64Url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(rawPrivateKey.replace(/\\n/g, "\n")).toString("base64url")}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error("Google authentication failed.");
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Google did not return an access token.");
  return data.access_token;
}

async function appendSheetRow(sheetName: string, values: Array<string | number>) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("Google Sheet ID is missing.");
  const token = await getGoogleAccessToken();
  const safeSheetName = sheetName.replaceAll("'", "''");
  const range = encodeURIComponent(`'${safeSheetName}'!A:H`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    },
  );
  if (!response.ok) throw new Error("Google Sheets could not save the form submission.");
}

async function sendEmail({ email, subject, text }: { email: string; subject: string; text: string }) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  if (gmailUser && gmailAppPassword) {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });
    await transport.sendMail({
      from: `Oxsa Nepal <${gmailUser}>`,
      to,
      replyTo: email,
      subject,
      text,
    });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) throw new Error("Email delivery is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
  });
  if (!response.ok) throw new Error("The email could not be delivered.");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!["contact", "sponsor", "adoption"].includes(type)) {
    return NextResponse.json({ message: "Unknown form." }, { status: 404 });
  }

  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const bucket = recent.get(ip);
  if (bucket && bucket.reset > now && bucket.count >= 5) {
    return NextResponse.json({ message: "Too many submissions. Please wait and try again." }, { status: 429 });
  }
  recent.set(ip, {
    count: bucket && bucket.reset > now ? bucket.count + 1 : 1,
    reset: bucket && bucket.reset > now ? bucket.reset : now + 60_000,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  if (type === "sponsor") {
    const parsed = sponsorSchema.safeParse(body);
    if (!parsed.success || parsed.data.website) {
      return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
    }
    const animal = animals.find(({ slug }) => slug === parsed.data.animal);
    const customAmount = Number(parsed.data.customContribution);
    const amount = parsed.data.contribution === "custom" ? customAmount : Number(parsed.data.contribution);
    if (!animal || !Number.isInteger(amount) || amount < 100 || amount > 1_000_000) {
      return NextResponse.json({ message: "Please choose an animal and a valid monthly amount." }, { status: 400 });
    }
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ message: "Sponsorship storage is not configured yet." }, { status: 503 });
    }

    const message = parsed.data.message || "";
    const amountLabel = `Rs ${amount.toLocaleString("en-IN")}`;
    const whatsappText = [
      "Hello Oxsa Nepal, I would like to sponsor an animal.",
      "",
      "Sponsorship details",
      "",
      `Name: ${parsed.data.fullName}`,
      "",
      `Email: ${parsed.data.email}`,
      "",
      `WhatsApp: ${parsed.data.phone}`,
      "",
      `Animal: ${animal.name}`,
      "",
      `Monthly contribution: ${amountLabel}`,
      ...(message ? ["", `Message: ${message}`] : []),
    ].join("\n");

    try {
      await appendSheetRow(process.env.GOOGLE_SHEET_NAME || "Sponsorships", [
        Date.now() / 86_400_000 + 25_569,
        parsed.data.fullName,
        parsed.data.email,
        parsed.data.phone,
        animal.name,
        amount,
        message,
        "Website sponsorship form",
      ]);
    } catch (error) {
      console.error("Sponsor submission failed:", error instanceof Error ? error.message : "Unknown error");
      return NextResponse.json({ message: "We could not save your sponsorship right now. Please try again." }, { status: 502 });
    }

    return NextResponse.json({
      message: "Your sponsorship details were saved. Opening WhatsApp…",
      whatsappUrl: `${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappText)}`,
    });
  }

  if (type === "contact") {
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success || parsed.data.website) {
      return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
    }
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ message: "Contact form storage is not configured yet." }, { status: 503 });
    }

    try {
      await appendSheetRow(process.env.GOOGLE_CONTACT_SHEET_NAME || "Contact form", [
        Date.now() / 86_400_000 + 25_569,
        parsed.data.fullName,
        parsed.data.email,
        parsed.data.phone,
        parsed.data.subject,
        parsed.data.message,
        "Website contact form",
        "New",
      ]);
    } catch (error) {
      console.error("Contact submission failed:", error instanceof Error ? error.message : "Unknown error");
      return NextResponse.json({ message: "We could not save your message right now. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ message: "Thank you. Your message has been saved for Oxsa Nepal." });
  }

  const parsed = base.safeParse(body);
  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }
  const safe = Object.entries(parsed.data)
    .filter(([key]) => key !== "website")
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${String(value).replace(/[<>]/g, "")}`)
    .join("\n\n");
  try {
    await sendEmail({
      email: parsed.data.email,
      subject: `Oxsa Nepal ${type} form — ${parsed.data.fullName}`,
      text: safe,
    });
  } catch (error) {
    console.error("Form delivery failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "The message could not be delivered." }, { status: 502 });
  }
  return NextResponse.json({ message: "Thank you. Your message has been sent to Oxsa Nepal." });
}
