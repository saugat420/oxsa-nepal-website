import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", `${port}`], {
    cwd: new URL("..", import.meta.url),
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Next production server did not start in time");
});

after(() => {
  server?.kill("SIGTERM");
});

async function render(path = "/") {
  return fetch(`${baseUrl}${path}`, { headers: { accept: "text/html" } });
}

test("server-renders the completed Oxsa Nepal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Oxsa Nepal \| Animal Welfare Society<\/title>/i);
  assert.match(html, /Oxsa Nepal/);
  assert.match(html, /Every street animal deserves/i);
  assert.match(html, /images\/logo\/oxsa-logo\.png/i);
  assert.match(html, /images\/content\/hero-image-v2\.png/i);
  assert.match(html, /images\/content\/our-story\.jpg/i);
  assert.match(html, /hero-title[\s\S]*Oxsa Nepal works[\s\S]*hero-image-v2[\s\S]*hero-actions/i);
  assert.doesNotMatch(html, /\bOXSA\b/);
  assert.match(html, /favicon\.png\?v=3/i);
  assert.match(html, /href="\/donate"/);
  assert.match(html, /href="\/sponsor"/);
  assert.match(html, /href="\/adopt"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /aria-label="Open navigation"/);
  assert.match(html, /aria-controls="explore-menu"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("donation page contains the verified payment details and QR assets", async () => {
  const response = await render("/donate");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /9849321303/);
  assert.match(html, /Oxsa Nepal Animal Welfare Organization/);
  assert.match(html, /01901017501825/);
  assert.match(html, /Nabil Bank Ltd/);
  assert.match(html, /sonysukaso@gmail\.com/);
  assert.match(html, /images\/donations\/esewa-qr\.jpeg/);
  assert.match(html, /images\/donations\/paypal-qr\.jpeg/);
  assert.match(html, /wa\.me\/9779849321303/);
  assert.match(html, /favicon\.png\?v=3/i);
  assert.doesNotMatch(html, /No contribution is too small|Medicines &amp; checkups|Veterinary support/i);
});

test("sponsor page lists the current 21 photo-backed shelter residents", async () => {
  const response = await render("/sponsor");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /21 shelter residents/i);
  assert.equal((html.match(/Oxsa Nepal shelter (?:dog|cat)/gi) ?? []).length, 21);
  for (const name of ["Nemo", "Choti Kali", "Badi Kali", "Mimi", "Betali", "Sweaty"]) {
    assert.match(html, new RegExp(`>${name}<`));
  }
  for (const name of ["Seti", "Bhattu", "Pinky", "Seru"]) {
    assert.doesNotMatch(html, new RegExp(`>${name}<`));
  }
});

test("vet directory includes verified nationwide contacts, filters and map links", async () => {
  const response = await render("/vet-centres");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/class="vet-card"/g) ?? []).length, 51);
  assert.match(html, /National Referral Veterinary Hospital/);
  assert.match(html, /Veterinary Hospital and Livestock Service Expert Centre — Bajura/);
  for (const province of ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"]) assert.match(html, new RegExp(`>${province}<`));
  assert.match(html, /Search name, phone, city, district or place/);
  assert.match(html, /google\.com\/maps\/search\/\?api=1(?:&amp;|&)query=/);
  assert.match(html, /href="tel:015361382"/);
  assert.match(html, /Official source/);
});

test("primary navigation routes render successfully", async () => {
  const routes = [
    "/about",
    "/our-work",
    "/donate",
    "/sponsor",
    "/adopt",
    "/stories",
    "/blog",
    "/wishlist",
    "/vet-centres",
    "/faq",
    "/media",
    "/contact",
  ];

  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
      `${route} should return HTML`,
    );
    const html = await response.text();
    assert.match(html, /favicon\.png\?v=3/i, `${route} should include the global favicon`);
  }
});

test("requested page content updates render cleanly", async () => {
  const about = await (await render("/about")).text();
  assert.match(about, /class="belief-quote"[\s\S]*Our belief[\s\S]*<strong>IF NOT US, THEN WHO\?<\/strong>[\s\S]*Compassion begins/i);

  const workPage = await (await render("/our-work")).text();
  assert.doesNotMatch(workPage, /Programme 0\d/i);

  const contact = await (await render("/contact")).text();
  assert.match(contact, /10:00 AM [–—-] 3:00 PM/);
});

test("every rendered internal link resolves successfully", async () => {
  const pending = ["/"];
  const visited = new Set();

  while (pending.length) {
    const path = pending.shift();
    if (!path || visited.has(path)) continue;
    visited.add(path);

    const response = await render(path);
    assert.equal(response.status, 200, `${path} should return 200`);
    const html = await response.text();

    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      const url = new URL(href, "http://localhost");
      if (
        url.origin !== "http://localhost" ||
        !url.pathname.startsWith("/") ||
        url.pathname.startsWith("/_next/") ||
        url.pathname.startsWith("/images/") ||
        /\.[a-z0-9]+$/i.test(url.pathname)
      ) continue;
      const nextPath = `${url.pathname}${url.search}`;
      if (!visited.has(nextPath)) pending.push(nextPath);
    }
  }

  assert.ok(visited.size > 20, `expected a full-site crawl, visited ${visited.size} routes`);
});

test("unknown routes return a proper not-found response", async () => {
  const response = await render("/this-page-does-not-exist");
  assert.equal(response.status, 404);
});

test("internal navigation uses production-safe native links", async () => {
  const files = [
    "../src/components/HeaderNav.tsx",
    "../src/components/SiteChrome.tsx",
    "../src/components/Interactive.tsx",
    "../src/components/Pages.tsx",
    "../app/not-found.tsx",
  ];
  const source = await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
  );

  for (const contents of source) assert.doesNotMatch(contents, /next\/link/);
  assert.doesNotMatch(source.join("\n"), /[✚⌂◒✦◎]/);
});
