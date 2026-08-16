# 失重档案

一个为 GitHub Pages 制作的静态中文文学站，收录 15 篇原作与协作新作《近地飞行》。网站包含作品检索、年代筛选、独立阅读页、明暗主题和阅读进度。

## 本地预览

```bash
npm run build
npm run preview
```

打开 `http://localhost:4173`。

## 发布

仓库已包含 GitHub Pages 工作流。将仓库推送到 GitHub 的 `main` 分支，然后在仓库设置的 **Pages → Build and deployment → Source** 中选择 **GitHub Actions**，即可自动发布。

正文源文件位于 `content/`，修改或新增文章后运行 `npm run build` 更新 `docs/`。
