# Hurroo 的个人博客

复古书籍风格的静态博客。本地第一版使用 Python 标准库生成网页，无需安装 Hugo 或前端依赖。文章原稿以 Markdown 保存，后续可以迁移到 Hugo 或 WordPress。

## 本地预览

```sh
python3 scripts/build.py
python3 -m http.server 8000 --directory public
```

打开 http://localhost:8000。修改内容后重新执行构建，再刷新页面。

## 写文章

在 `content/posts/` 新建 UTF-8 的 `.md` 文件，文件名如 `2026-10-27-my-day.md`：

```md
---
title: 我的一天
date: 2026-10-27
category: 随记
---
正文段落。

## 小标题

另一个段落。
```

当前轻量生成器支持段落和二级标题，其他 Markdown 语法暂未支持。示例文章用于预览，请在正式发布前修改或删除。首页、关于等内容在 `scripts/build.py` 中修改。字体在线加载；离线时使用系统衬线字体。

## 发布到 GitHub Pages

建议使用用户主页仓库 `hurroo7.github.io`，工作流按根域名路径配置。把源码上传到该仓库的 `main` 分支，在仓库 Settings → Pages 将 Source 设为 GitHub Actions。之后推送会自动构建和发布。项目子路径仓库需要先调整网址路径。

网站尚未上传至 GitHub，也没有对外发布。
