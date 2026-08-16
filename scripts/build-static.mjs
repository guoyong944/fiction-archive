import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const outputDir = path.join(root, "docs");
const assetDir = path.join(root, "assets-src");

const featuredTitles = new Set([
  "狼王",
  "下沉",
  "船长",
  "立交桥",
  "一个车辆工程毕业生之死",
]);

const editorial = {
  "立交桥": ["城市边缘", "青春", "逃亡"],
  "船长": ["港口", "漂泊", "老张"],
  "退潮": ["大海", "友情", "故乡"],
  "拉面店": ["县城", "记忆", "黑色幽默"],
  "你离开了米兰从此没有人陪我说话": ["异乡", "离别", "华人餐馆"],
  "钟楼": ["城市漫游", "梦境", "时间"],
  "无可救药的世界和屎一样的我们": ["青春", "网吧", "随笔"],
  "波罗的海与蘑菇": ["幻觉", "信仰", "海岸"],
  "狼王": ["网吧", "时代", "人物"],
  "最后的诗人": ["科幻", "人工智能", "诗歌"],
  "空姐，学妹和辣条": ["身份", "讽刺", "青春"],
  "在凌晨三点雨夜的上海骑小黄车是一件很朋克的事": ["上海", "雨夜", "朋克"],
  "23岁时候的我都在想些什么": ["回忆", "旅行", "随笔"],
  "一个车辆工程毕业生之死": ["工业", "职业", "下沉"],
  "下沉": ["流亡", "阶层", "老张"],
  "近地飞行": ["新作", "机场", "逃离"],
};

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const slugify = (filename) =>
  filename
    .replace(/\.txt$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}_/, "")
    .normalize("NFKC")
    .replace(/[，。？！、：；“”‘’（）《》〈〉【】\s]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";

function parseArticle(filename) {
  const raw = fs.readFileSync(path.join(contentDir, filename), "utf8").replace(/\r/g, "");
  const lines = raw.split("\n");
  const title = lines[0].trim();
  const dateFromName = filename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
  const date = raw.match(/发布时间：\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? dateFromName;
  const author =
    raw.match(/^作者：\s*(.+)$/m)?.[1]?.trim() ??
    raw.match(/原创：\s*([^\n]+)/)?.[1]?.trim() ??
    "Captain Guo";
  const account = raw.match(/^公众号：\s*(.+)$/m)?.[1]?.trim() ?? "";
  const originalUrl = raw.match(/^原链接：\s*(https?:\/\/\S+)/m)?.[1]?.trim() ?? "";
  const note = raw.match(/^说明：\s*(.+)$/m)?.[1]?.trim() ?? "";
  const dividerIndex = lines.findIndex((line) => /^-{10,}$/.test(line.trim()));
  const bodyLines = lines.slice(dividerIndex >= 0 ? dividerIndex + 1 : 3);
  const bodyText = bodyLines
    .filter((line) => line.trim() && line.trim() !== "[图片]")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  const excerpt = bodyText.slice(0, 92) + (bodyText.length > 92 ? "……" : "");
  const charCount = bodyText.replace(/\s/g, "").length;
  return {
    filename,
    slug: slugify(filename),
    title,
    date,
    year: date.slice(0, 4),
    author,
    account,
    originalUrl,
    note,
    bodyLines,
    excerpt,
    charCount,
    minutes: Math.max(1, Math.round(charCount / 500)),
    tags: editorial[title] ?? ["作品"],
    featured: featuredTitles.has(title),
    isNew: title === "近地飞行",
  };
}

function renderBody(lines) {
  return lines
    .map((rawLine) => {
      const line = rawLine.trim();
      if (!line) return "";
      if (line === "[图片]") {
        return '<figure class="missing-image"><span>影像存档</span><figcaption>原文图片未收录</figcaption></figure>';
      }
      if (/^(?:\(?[一二三四五六七八九十]+\)?|\d{1,2}[）).]?)$/.test(line)) {
        return `<h2 class="section-mark">${escapeHtml(line)}</h2>`;
      }
      if (/^—+$/.test(line)) return "";
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("\n");
}

function shell({ title, description, assetPrefix, homePrefix, body, pageClass = "" }) {
  return `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f2eee5">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="${assetPrefix}assets/styles.css">
  <script>try{document.documentElement.dataset.theme=localStorage.getItem('fiction-archive-theme')||'light'}catch(e){}</script>
</head>
<body class="${pageClass}">
  <a class="skip-link" href="#main">跳到正文</a>
  <div class="reading-progress" aria-hidden="true"><span></span></div>
  <header class="site-header">
    <a class="wordmark" href="${homePrefix}"><span>失重</span>档案</a>
    <nav aria-label="主导航">
      <a href="${homePrefix}">作品</a>
      <a href="${homePrefix}about/">关于</a>
      <button class="theme-toggle" type="button" aria-label="切换明暗主题"><span aria-hidden="true">◐</span></button>
    </nav>
  </header>
  ${body}
  <footer class="site-footer">
    <p>失重档案 · 2015—2026</p>
    <p>保留粗粝，也保留那些没有说完的话。</p>
  </footer>
  <script src="${assetPrefix}assets/site.js" defer></script>
</body>
</html>`;
}

function card(article) {
  const search = [article.title, article.excerpt, article.author, ...article.tags].join(" ");
  return `<article class="work-card${article.featured ? " featured" : ""}" data-year="${article.year}" data-search="${escapeHtml(search.toLowerCase())}">
    <a href="articles/${encodeURIComponent(article.slug)}/" aria-label="阅读《${escapeHtml(article.title)}》">
      <div class="card-topline">
        <time datetime="${article.date}">${article.date.replaceAll("-", ".")}</time>
        <span class="card-meta">${article.isNew ? '<strong class="ai-label ai-label-small">AI 创作</strong>' : ""}<span>${article.minutes} 分钟</span></span>
      </div>
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.excerpt)}</p>
      <div class="card-footer">
        <span class="tags">${article.tags.map((tag) => `<i>${escapeHtml(tag)}</i>`).join("")}</span>
        <span class="read-arrow" aria-hidden="true">↗</span>
      </div>
    </a>
  </article>`;
}

function buildIndex(articles) {
  const years = [...new Set(articles.map((article) => article.year))].sort((a, b) => b.localeCompare(a));
  const originals = articles.filter((article) => !article.isNew);
  const body = `<main id="main">
    <section class="hero">
      <p class="eyebrow">A FICTION ARCHIVE · 2015—2026</p>
      <h1>失重的人，<br><em>仍在向前。</em></h1>
      <div class="hero-note">
        <p>十五篇旧作与一篇新作。关于县城、港口、网吧、异乡，以及一群始终没有找到归宿的人。</p>
        <dl>
          <div><dt>${articles.length}</dt><dd>篇作品</dd></div>
          <div><dt>${originals.reduce((sum, item) => sum + item.charCount, 0).toLocaleString("zh-CN")}</dt><dd>原作字符</dd></div>
          <div><dt>6</dt><dd>年写作跨度</dd></div>
        </dl>
      </div>
    </section>

    <section class="archive" aria-labelledby="archive-title">
      <div class="section-heading">
        <div><p class="eyebrow">THE WORKS</p><h2 id="archive-title">作品档案</h2></div>
        <p id="result-count" aria-live="polite">${articles.length} 篇</p>
      </div>
      <div class="archive-tools">
        <label class="search-field"><span aria-hidden="true">⌕</span><span class="sr-only">搜索作品</span><input id="work-search" type="search" placeholder="搜索标题、主题或人物" autocomplete="off"></label>
        <div class="year-filters" role="group" aria-label="按年份筛选">
          <button type="button" class="active" data-filter="all">全部</button>
          ${years.map((year) => `<button type="button" data-filter="${year}">${year}</button>`).join("")}
        </div>
      </div>
      <div class="work-grid" id="work-grid">${articles.map(card).join("\n")}</div>
      <p class="empty-state" hidden>没有找到相符的作品。</p>
    </section>

    <section class="manifesto">
      <p class="eyebrow">EDITOR'S NOTE</p>
      <blockquote>“身体不断远行，精神原地踏步。”</blockquote>
      <p>这些故事在城市背面寻找人物：桥洞、后厨、网吧、码头和没有终点的火车。繁华一直存在，只是它在很远的地方。</p>
      <a class="text-link" href="about/">阅读作品导言 <span aria-hidden="true">→</span></a>
    </section>
  </main>`;
  fs.writeFileSync(path.join(outputDir, "index.html"), shell({
    title: "失重档案 · 小说作品集",
    description: "十五篇旧作与一篇新作：关于县城、港口、网吧、异乡，以及始终没有找到归宿的人。",
    assetPrefix: "",
    homePrefix: "./",
    body,
    pageClass: "home-page",
  }));
}

function buildArticle(article, index, articles) {
  const previous = articles[index - 1];
  const next = articles[index + 1];
  const chips = article.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const source = article.originalUrl
    ? `<a href="${escapeHtml(article.originalUrl)}" target="_blank" rel="noreferrer">查看原始发布 ↗</a>`
    : "<span>AI 协作新作</span>";
  const body = `<main id="main" class="article-page">
    <article>
      <header class="article-hero">
        <a class="back-link" href="../../">← 返回作品档案</a>
        <div class="article-kicker"><time datetime="${article.date}">${article.date.replaceAll("-", " / ")}</time><span>${article.minutes} 分钟阅读</span></div>
${article.isNew ? '        <strong class="ai-label article-ai-label">AI 创作</strong>\n' : ""}        <h1>${escapeHtml(article.title)}</h1>
        <p class="article-byline">${escapeHtml(article.author)}</p>
        <div class="article-tags">${chips}</div>
      </header>
      <div class="article-rule"><span></span></div>
      ${article.note ? `<aside class="article-note"><strong>编者说明</strong><p>${escapeHtml(article.note)}</p></aside>` : ""}
      <div class="prose">${renderBody(article.bodyLines)}</div>
      <footer class="article-source"><p>初次发布于 ${article.date}</p>${source}</footer>
    </article>
    <nav class="article-nav" aria-label="前后作品">
      ${previous ? `<a href="../${encodeURIComponent(previous.slug)}/"><span>上一篇</span><strong>${escapeHtml(previous.title)}</strong></a>` : "<span></span>"}
      ${next ? `<a class="next" href="../${encodeURIComponent(next.slug)}/"><span>下一篇</span><strong>${escapeHtml(next.title)}</strong></a>` : "<span></span>"}
    </nav>
  </main>`;
  const dir = path.join(outputDir, "articles", article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shell({
    title: `${article.isNew ? "AI 创作 · " : ""}${article.title} · 失重档案`,
    description: article.excerpt,
    assetPrefix: "../../",
    homePrefix: "../../",
    body,
    pageClass: "reading-page",
  }));
}

function buildAbout(articles) {
  const body = `<main id="main" class="about-page">
    <header class="about-hero">
      <p class="eyebrow">ABOUT THE ARCHIVE</p>
      <h1>写给那些<br>没有抵达的人</h1>
    </header>
    <div class="about-layout">
      <aside><p>2015—2020</p><p>${articles.filter((item) => !item.isNew).length} 篇原作</p><p>1 篇协作新作</p></aside>
      <div class="about-copy">
        <p class="lead">这不是一组彼此孤立的故事，而是一部被拆散书写的反成长小说。</p>
        <p>人物去过越来越多的地方，却越来越无法确认自己是谁。地理空间从县城、广州、上海和厦门扩张到欧洲港口，最后抵达未来；他们的精神位置却始终停留在城市边缘。</p>
        <h2>反复出现的人与地方</h2>
        <p>老张、小卫、阿豪等人物以不同身份重返故事。网吧、海港、桥、火车、烟雾与探照灯也不断变形复现。这里并不追求一条可以核对的现实时间线，而是在建立一座由记忆、虚构和自我投射组成的私人城市。</p>
        <h2>关于《近地飞行》</h2>
        <p>《近地飞行》由 Codex 在完整阅读原作后创作。它吸收了这些作品对失败者、远行和城市废墟的持续关注，沿用“老张”这一反复出现的人物，并采用新地点与独立情节；页面在标题处明确标注“AI 创作”，以区别于十五篇原作。</p>
        <h2>存档说明</h2>
        <p>正文依据本地文本整理，保留原始发布日期、作者署名和可用的公众号链接。原文中以“图片”标记但未随文本保存的内容，在相应位置注明缺失，没有使用替代图片。</p>
        <a class="text-link" href="../">进入作品档案 <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </main>`;
  const dir = path.join(outputDir, "about");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shell({
    title: "关于 · 失重档案",
    description: "关于失重档案、反复出现的人物与意象，以及协作新作《近地飞行》。",
    assetPrefix: "../",
    homePrefix: "../",
    body,
    pageClass: "about-body",
  }));
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outputDir, "assets"), { recursive: true });
for (const filename of ["styles.css", "site.js"]) {
  fs.copyFileSync(path.join(assetDir, filename), path.join(outputDir, "assets", filename));
}
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

const articles = fs
  .readdirSync(contentDir)
  .filter((filename) => filename.endsWith(".txt"))
  .map(parseArticle)
  .sort((a, b) => b.date.localeCompare(a.date));

buildIndex(articles);
articles.forEach((article, index) => buildArticle(article, index, articles));
buildAbout(articles);
fs.copyFileSync(path.join(outputDir, "index.html"), path.join(outputDir, "404.html"));

console.log(`Built ${articles.length} articles into ${path.relative(root, outputDir)}/`);
