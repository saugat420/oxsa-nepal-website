import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the completed OXSA Nepal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>OXSA Nepal \| Animal Welfare Society<\/title>/i);
  assert.match(html, /OXSA Nepal/);
  assert.match(html, /Every street animal deserves/i);
  assert.match(html, /href="\/donate"/);
  assert.match(html, /href="\/sponsor"/);
  assert.match(html, /href="\/adopt"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /aria-label="Open navigation"/);
  assert.match(html, /aria-controls="explore-menu"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
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
  }
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
});
