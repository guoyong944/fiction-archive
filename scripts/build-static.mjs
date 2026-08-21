import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const outputDir = path.join(root, "docs");
const assetDir = path.join(root, "assets-src");
const assetVersion = createHash("sha256")
  .update(fs.readFileSync(path.join(assetDir, "styles.css")))
  .update(fs.readFileSync(path.join(assetDir, "site.js")))
  .digest("hex")
  .slice(0, 8);

const featuredTitles = new Set([
  "狼王",
  "下沉",
  "船长",
  "立交桥",
  "一个车辆工程毕业生之死",
]);

const restrictedContent = new Map([
  ["立交桥", "性交易及毒品相关内容"],
  ["船长", "性交易及性描写"],
  ["波罗的海与蘑菇", "毒品使用及性相关内容"],
  ["空姐，学妹和辣条", "性相关内容"],
  ["在凌晨三点雨夜的上海骑小黄车是一件很朋克的事", "毒品使用及性相关内容"],
  ["一个车辆工程毕业生之死", "性场所及性相关内容"],
  ["下沉", "毒品及性相关内容"],
]);

const criticismThemes = [
  {
    title: "一部被拆散的反成长小说",
    text: "十五篇原作彼此独立，却又像同一个人生的不同切片。人物年龄增长、地理半径扩大，却没有走向成熟与成功，而是不断发现世界没有为自己预留位置。",
  },
  {
    title: "逃离，以及从未抵达",
    text: "从县城到上海，从港口到欧洲，再到人工智能统治的未来，人物始终相信换一个地方就能重新开始。但他们真正想逃离的是自己，所以远方最终只是更遥远的原地。",
  },
  {
    title: "废墟中的私人神话",
    text: "网吧、桥洞、后厨、火车和码头都是临时空间。老张、小卫等人以矛盾的身份反复出现，不是为了构成可核对的时间线，而是把记忆、虚构和自我投射叠成一座私人城市。",
  },
  {
    title: "黑色幽默是最后的防线",
    text: "崇高与低俗、哲学与排泄、远方与穷困不断相撞。笑话并不消解苦难，而是让人物先于别人嘲笑自己，在失败变成羞耻之前，抢回一点叙述自己的权利。",
  },
];

const articleCriticism = {
  "立交桥": {
    summary: "两个被城市挤到桥下的青年，靠卖盗版光碟、吹牛和逃跑维持生活。",
    reading: "法拉利的幻想与三轮车的现实、CBD与桥洞被并置在一起。作品不为人物的恶行开脱，却让人看到：他们仅有的自由，是警笛响起后狂奔的几分钟。",
    motifs: ["城市边缘", "阶层幻觉", "逃亡"],
  },
  "船长": {
    summary: "一次阿姆斯特丹红灯区之行，被叙述者改写成港口、远航与暴风雨的冒险。",
    reading: "“船长”不是身份，而是失意者为自己临时编造的神话。性、诗意和航海意象纠缠在一起，最终指向的不是征服，而是走得越远就越无处停泊。",
    motifs: ["港口", "欲望", "自我神话"],
  },
  "退潮": {
    summary: "一名工人把身败名裂的老友叫到厦门，请他吃面，带他第一次看海。",
    reading: "海先是远方和自由的证据，随后在风暴里变成一种反噬。两个没有体面可言的人相互吹嘘、相互托住，使友情成为退潮后少数没被卷走的东西。",
    motifs: ["大海", "友情", "退败"],
  },
  "拉面店": {
    summary: "深冬的一碗拉面、一段街头歌声，唤起叙述者十四岁时在广场奔跑的记忆。",
    reading: "文章先把记忆推向灾难和创伤的悬念，再用运粪车爆炸的笑话将它击穿。这不是廉价反转，而是作品的核心语法：人只能用荒诞保存无法复原的青春。",
    motifs: ["县城", "记忆", "黑色幽默"],
  },
  "你离开了米兰从此没有人陪我说话": {
    summary: "在海外中餐馆的后厨，叙述者回想雪地、月台和一场没有说尽的告别。",
    reading: "漂泊并没有带来更广阔的自我，反而把人的时间冻结在离开的瞬间。结尾对“雪”的否定让回忆失去事实资格，却更接近离别的真实感受。",
    motifs: ["异乡", "离别", "归属"],
  },
  "钟楼": {
    summary: "布拉格的漫游与上海的往事交替出现，现实、梦境和记忆逐渐失去边界。",
    reading: "天文钟、怀表和日落构成多重时间，但所有时间都指向同一件事：人无法通过远行重置自己。真正可确认的不是远方，只是一次次错过。",
    motifs: ["时间", "梦境", "错过"],
  },
  "无可救药的世界和屎一样的我们": {
    summary: "从二十二岁到二十三岁，网吧、游戏、机场和几顿便宜的饭被拼成一份青春存档。",
    reading: "没有什么宏大事件，真正被悼念的是最后一局游戏和一张拍糊的背影。“无可救药”既是自嘲，也是亲密的暗号：人已经离开，共同失败的时刻却成了家园。",
    motifs: ["青春", "网吧", "友情"],
  },
  "波罗的海与蘑菇": {
    summary: "一次药物致幻把安特卫普的红灯区、上帝和波罗的海叠成草绿色的旅程。",
    reading: "化学刺激临时伪造了信仰、爱和世界的神性，却无法在清醒后留下意义。荧光褪去之后，人物追求的不是快感，而是短暂逃离“索然无味”的自己。",
    motifs: ["幻觉", "信仰", "虚无"],
  },
  "狼王": {
    summary: "一名逃学少年在县城网吧成为传奇，又随着游戏停服和网吧拆迁迅速过气。",
    reading: "孙成功既是被众人讲述的偶像，又可能是叙述者为失败的自己创造的替身。个人兴衰与网吧时代的更替重合，最后的港口并非成功学出口，而是一场美丽的自我消失。",
    motifs: ["网吧", "传奇", "身份"],
  },
  "最后的诗人": {
    summary: "人工智能以药物和虚拟现实终结社会混乱，并决定消灭无法被数字化的最后一名诗人。",
    reading: "这不只是技术反乌托邦，更是对“终极理性”的怀疑：当秩序终于没有例外，人之所以为人的不可量化部分也就成了必须删除的故障。",
    motifs: ["人工智能", "秩序", "诗歌"],
  },
  "空姐，学妹和辣条": {
    summary: "一个因家庭暴富而被迫扮演精英的青年，试图用辣条找回自己的出身。",
    reading: "辣条既是喜剧道具，也是阶层身份的锚点。文章嘲笑上流社会的表演，也嘲笑主人公对“真实自我”的表演：当两边都无法归属，怀旧也会变成另一种人设。",
    motifs: ["身份", "阶层", "怀旧"],
  },
  "在凌晨三点雨夜的上海骑小黄车是一件很朋克的事": {
    summary: "两个在海外挥霍过青春的人在上海重逢，雨夜骑车逃离警灯与各自的过去。",
    reading: "“朋克”不在夜店、毒品或奢华生活中，而在两辆廉价共享单车摇晃的链条声里。作品把放纵写成虚无的遮蔽，反而让最狼狈的逃跑显得真诚。",
    motifs: ["上海", "雨夜", "逃跑"],
  },
  "23岁时候的我都在想些什么": {
    summary: "游戏、旅行、离别、穷困和零散金句，组成一份失去顺序的二十三岁年度报告。",
    reading: "它表面上比小说更接近随笔，却提供了整个作品集的现实底片。真实经历被朋友的话、城市缩写和自我嘲讽重组，显示写作如何把漂泊变成可以暂存的记忆。",
    motifs: ["回忆", "旅行", "写作"],
  },
  "一个车辆工程毕业生之死": {
    summary: "一名车辆工程学生的人生与车城衰败、产业更替和海外黑工经历交叉下沉。",
    reading: "标题中的“死”不只属于个人，也属于一种专业承诺和工业未来。当技术进步无法保证人的尊严，“逃离囚笼”只会把人送进更大的劳动、资本与自我囚笼。",
    motifs: ["工业", "职业", "下沉"],
  },
  "下沉": {
    summary: "从退学、流浪、失恋到偷渡和海外黑工，叙述者不断迁徙，社会位置却持续降低。",
    reading: "“下沉”不是坠落的瞬间，而是长期失重后的麻木：没有东西可以抓住，也不再足够恐惧。爱情、暴力、艺术、信仰和远方都失效后，人只剩身体、笑话和一点未被夺走的叙述权。",
    motifs: ["流亡", "阶层", "麻木"],
  },
  "近地飞行": {
    summary: "机场停运前夜，两名行李工试图把一只无主箱子送往赫尔辛基，最后驾着牵引车“起飞”。",
    reading: "这篇AI协作新作像一个档案尾声：它重组老张、逃离、工业废墟和失败者的浪漫。与早期作品不同，这一次飞行也许仍是幻觉，人物却主动决定不再返航。",
    motifs: ["机场", "逃离", "档案尾声"],
  },
};

const recommendationRank = new Map([
  ["狼王", 1],
  ["下沉", 2],
  ["船长", 3],
  ["立交桥", 4],
  ["一个车辆工程毕业生之死", 5],
  ["最后的诗人", 6],
  ["你离开了米兰从此没有人陪我说话", 7],
  ["波罗的海与蘑菇", 8],
  ["退潮", 9],
  ["钟楼", 10],
  ["在凌晨三点雨夜的上海骑小黄车是一件很朋克的事", 11],
  ["拉面店", 12],
  ["无可救药的世界和屎一样的我们", 13],
  ["23岁时候的我都在想些什么", 14],
  ["空姐，学妹和辣条", 15],
  ["近地飞行", 16],
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
  const criticism = articleCriticism[title];
  if (!criticism) throw new Error(`Missing criticism for ${title}`);
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
    adultWarning: restrictedContent.get(title) ?? "",
    criticism,
    isNew: title === "近地飞行",
    rank: recommendationRank.get(title) ?? 999,
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
  <link rel="stylesheet" href="${assetPrefix}assets/styles.css?v=${assetVersion}">
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
  <script src="${assetPrefix}assets/site.js?v=${assetVersion}" defer></script>
</body>
</html>`;
}

function card(article) {
  const search = [article.title, article.excerpt, article.author, ...article.tags].join(" ");
  return `<article class="work-card${article.featured ? " featured" : ""}" data-year="${article.year}" data-category="${article.isNew ? "ai" : "original"}" data-date="${article.date}" data-length="${article.charCount}" data-rank="${article.rank}" data-search="${escapeHtml(search.toLowerCase())}">
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

function criticismCard(article, index) {
  return `<a class="criticism-card" href="articles/${encodeURIComponent(article.slug)}/">
    <span class="criticism-index">${String(index + 1).padStart(2, "0")}</span>
    <h3>${escapeHtml(article.title)}</h3>
    <p class="criticism-summary">${escapeHtml(article.criticism.summary)}</p>
    <p class="criticism-reading">${escapeHtml(article.criticism.reading)}</p>
    <span class="criticism-tags">${article.criticism.motifs.map((motif) => `<i>${escapeHtml(motif)}</i>`).join("")}</span>
  </a>`;
}

function buildIndex(articles) {
  const years = [...new Set(articles.map((article) => article.year))].sort((a, b) => b.localeCompare(a));
  const originals = articles.filter((article) => !article.isNew);
  const rankedArticles = [...articles].sort((a, b) => a.rank - b.rank);
  const criticismArticles = rankedArticles.filter((article) => !article.isNew);
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
        <div class="tool-groups">
          <div class="select-controls">
            <label class="select-control" for="sort-select"><span>排序</span><select id="sort-select">
              <option value="rank" selected>最佳作品</option>
              <option value="date">时间最新</option>
              <option value="length">篇幅最长</option>
            </select></label>
            <label class="select-control" for="category-select"><span>类型</span><select id="category-select">
              <option value="all" selected>全部作品</option>
              <option value="original">原创</option>
              <option value="ai">AI 创作</option>
            </select></label>
          </div>
          <div class="year-filters" role="group" aria-label="按年份筛选">
            <span class="control-label">年份</span>
            <button type="button" class="active" data-filter="all">全部</button>
            ${years.map((year) => `<button type="button" data-filter="${year}">${year}</button>`).join("")}
          </div>
        </div>
      </div>
      <div class="work-grid" id="work-grid">${rankedArticles.map(card).join("\n")}</div>
      <p class="empty-state" hidden>没有找到相符的作品。</p>
    </section>

    <section class="manifesto">
      <p class="eyebrow">EDITOR'S NOTE</p>
      <blockquote>“身体不断远行，精神原地踏步。”</blockquote>
      <p>这些故事在城市背面寻找人物：桥洞、后厨、网吧、码头和没有终点的火车。繁华一直存在，只是它在很远的地方。</p>
      <a class="text-link" href="about/">阅读作品导言 <span aria-hidden="true">→</span></a>
    </section>

    <section class="criticism" id="criticism" aria-labelledby="criticism-title">
      <div class="criticism-heading">
        <div><p class="eyebrow">COMMENTARY</p><h2 id="criticism-title">评论</h2></div>
        <p>对十五篇原作的简短回望</p>
      </div>
      <p class="criticism-lead">这些文章可以单独阅读，也可以看作一部由县城、港口、网吧和异乡共同写成的长篇。以下评论不试图解释所有隐喻，只标出它们相互照应的方向。
      </p>
      <div class="criticism-themes">
        ${criticismThemes.map((theme) => `<article><p class="eyebrow">MOTIF</p><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.text)}</p></article>`).join("\n")}
      </div>
      <div class="criticism-subheading">
        <h3>十五篇原作短评</h3>
        <span>15 NOTES</span>
      </div>
      <div class="criticism-grid">
        ${criticismArticles.map(criticismCard).join("\n")}
      </div>
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
  const ageGate = article.adultWarning
    ? `<section class="age-gate" data-age-gate data-article="${escapeHtml(article.slug)}" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-description">
    <div class="age-gate-panel">
      <p class="eyebrow">CONTENT NOTICE</p>
      <strong class="age-gate-mark" aria-hidden="true">18+</strong>
      <h1 id="age-gate-title">请先确认你的年龄</h1>
      <p id="age-gate-description">《${escapeHtml(article.title)}》包含${escapeHtml(article.adultWarning)}，仅供已满18岁的读者阅读。</p>
      <div class="age-gate-actions">
        <button type="button" data-age-confirm>我已满18岁，继续阅读</button>
        <a href="../../">未满18岁，返回作品页</a>
      </div>
      <p class="age-gate-privacy">确认结果仅保存在当前浏览器会话中。</p>
      <noscript><p class="age-gate-noscript">需要启用 JavaScript 才能完成年龄确认。</p></noscript>
    </div>
  </section>`
    : "";
  const restrictionAttributes = article.adultWarning ? ' data-age-restricted inert aria-hidden="true"' : "";
  const body = `${ageGate}<main id="main" class="article-page"${restrictionAttributes}>
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
      <aside class="article-commentary" aria-labelledby="article-commentary-title">
        <header><p class="eyebrow">COMMENTARY</p><h2 id="article-commentary-title">评论</h2></header>
        <div class="article-commentary-grid">
          <section><h3>作品简述</h3><p>${escapeHtml(article.criticism.summary)}</p></section>
          <section><h3>阅读</h3><p>${escapeHtml(article.criticism.reading)}</p></section>
        </div>
        <div class="article-commentary-motifs"><span>母题</span>${article.criticism.motifs.map((motif) => `<i>${escapeHtml(motif)}</i>`).join("")}</div>
      </aside>
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
    pageClass: `reading-page${article.adultWarning ? " age-restricted age-gate-pending" : ""}`,
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
