# Hurroo 的个人博客

使用 **Hugo 0.168.0 + GitHub Pages** 构建，自定义复古书籍风格，无需外部主题或 Python。

正式网址：https://hurroo7.github.io/

## 本地预览

从 https://gohugo.io/installation/ 安装 Hugo，在项目目录运行 `hugo server -D`，打开终端显示的地址（默认 http://localhost:1313/）。保存内容后预览自动更新。

## 写文章

运行 `hugo new content posts/my-new-post.md`，在 `content/posts/` 编辑生成的 Markdown。填入标题、日期、分类和简介，完成后把 `draft: true` 改为 `draft: false`。提交到 GitHub main 分支后自动发布。

支持 Hugo 内置 Markdown：标题、列表、链接、图片、引用、表格和代码块。现有文章为排版示例，可以修改或删除。

## 修改网站

- 网站介绍和目录：`hugo.toml`
- 关于与项目：`content/about.md`、`content/projects.md`
- 页面模板：`layouts/`
- 纸张背景与配色：`static/style.css`
- 夜间模式：`static/site.js`
- 自动发布：`.github/workflows/pages.yml`

运行 `hugo --gc --minify` 生成 `public/`，不提交生成文件。文章原地址和 🍁 图标保留。Google Fonts 不可用时使用系统衬线字体。
