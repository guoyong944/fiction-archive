import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const docs = path.join(root, "docs");
const content = path.join(root, "content");

test("publishes every source article as an independent page", () => {
  const sourceCount = fs.readdirSync(content).filter((name) => name.endsWith(".txt")).length;
  const articleCount = fs
    .readdirSync(path.join(docs, "articles"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(docs, "articles", entry.name, "index.html"))).length;
  assert.equal(sourceCount, 16);
  assert.equal(articleCount, sourceCount);
});

test("home page contains the archive controls and all article cards", () => {
  const html = fs.readFileSync(path.join(docs, "index.html"), "utf8");
  assert.match(html, /id="work-search"/);
  assert.match(html, /data-filter="2020"/);
  assert.equal((html.match(/class="work-card/g) ?? []).length, 16);
  assert.match(html, /近地飞行/);
  assert.match(html, /狼王/);
});

test("article pages retain long-form content and source metadata", () => {
  const wolf = fs.readFileSync(path.join(docs, "articles", "狼王", "index.html"), "utf8");
  const flight = fs.readFileSync(path.join(docs, "articles", "近地飞行", "index.html"), "utf8");
  assert.match(wolf, /孙成功/);
  assert.match(wolf, /查看原始发布/);
  assert.match(flight, /北陵国际机场/);
  assert.match(flight, /老张/);
  assert.doesNotMatch(flight, /阿孟/);
  assert.match(flight, /class="ai-label article-ai-label">AI 创作/);
  assert.match(flight, /Codex/);
});

test("every generated article has valid relative assets", () => {
  const folders = fs.readdirSync(path.join(docs, "articles"));
  for (const folder of folders) {
    const html = fs.readFileSync(path.join(docs, "articles", folder, "index.html"), "utf8");
    assert.match(html, /href="\.\.\/\.\.\/assets\/styles\.css"/);
    assert.match(html, /src="\.\.\/\.\.\/assets\/site\.js"/);
  }
});
