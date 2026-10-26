"""Build the blog with Python's standard library. Supports headings and paragraphs."""
from pathlib import Path
from html import escape
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
OUT.mkdir(exist_ok=True)
for asset in (ROOT / 'static').iterdir():
    shutil.copy2(asset, OUT / asset.name)

def document(title, body):
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} · Hurroo</title><meta name="description" content="Hurroo 的个人博客，记录生活、学习与创造。"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext x='2' y='54' font-size='54'%3E%F0%9F%8D%81%3C/text%3E%3C/svg%3E"><link rel="stylesheet" href="/style.css"><script src="/site.js" defer></script></head><body>{body}</body></html>'''

def write(path, title, body):
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(document(title, body), encoding='utf-8')

def page(title, english, content):
    return f'''<main class="page"><nav class="page-nav"><a class="wordmark" href="/">HURROO</a><a href="/">返回目录 ↗</a></nav><header class="page-header"><span class="small">{english}</span><h1>{title}</h1><p>记录生活、学习与创造</p></header>{content}<footer class="page-footer"><span>© 2026 HURROO · 私人笔记</span><button class="theme" aria-label="切换深色模式">☼</button></footer></main>'''

posts = []
for source in sorted((ROOT / 'content/posts').glob('*.md'), reverse=True):
    raw = source.read_text(encoding='utf-8')
    _, frontmatter, text = raw.split('---', 2)
    meta = dict(line.split(': ', 1) for line in frontmatter.strip().splitlines())
    slug = source.stem
    blocks = []
    for block in re.split(r'\n\s*\n', text.strip()):
        if block.startswith('## '):
            blocks.append(f'<h2>{escape(block[3:])}</h2>')
        else:
            blocks.append(f'<p>{escape(block)}</p>')
    title = escape(meta['title'])
    date = escape(meta['date'])
    content = f'<article class="prose"><p class="meta">{date} · {escape(meta["category"])} · 排版示例</p>{"".join(blocks)}</article>'
    write(f'posts/{slug}/index.html', meta['title'], page(title, 'FIELD NOTES', content))
    posts.append((slug, meta))

items = [('about','关于','About','I'), ('posts','文章','Writing','II'), ('projects','项目','Projects','III'), ('notes','随记','Notes','IV'), ('archives','归档','Archive','V')]
links = ''.join(f'<li><a href="/{url}/"><span class="label">{cn}<small>{en}</small></span><span class="dots"></span><span class="roman">{num}</span></a></li>' for url,cn,en,num in items)
write('index.html','目录', f'''<main class="cover"><div class="eyebrow"><span>A PERSONAL JOURNAL</span><span>EST. 2026</span></div><header><h1 class="brand">HURROO</h1><p class="subtitle">记录生活、学习与创造</p><div class="ornament" aria-hidden="true">❦</div></header><nav aria-label="网站目录"><ol class="contents">{links}</ol></nav><footer class="cover-footer"><p class="motto">把日子里的发现，慢慢写成一本书。</p><div class="edition">VOL. I &nbsp; · &nbsp; 第一卷</div><button class="theme" aria-label="切换深色模式">☼</button></footer></main>''')
entries = ''.join(f'<a class="entry" href="/posts/{slug}/"><span class="meta">{escape(meta["date"])} · {escape(meta["category"])}</span><h2>{escape(meta["title"])} ↗</h2><p>第一篇排版示例，关于这本笔记，以及写下去的理由。</p></a>' for slug,meta in posts)
write('posts/index.html','文章',page('文章','II · WRITING',entries))
write('notes/index.html','随记',page('随记','IV · NOTES',entries))
write('about/index.html','关于',page('关于','I · ABOUT','<article class="prose"><p>你好，我是 Hurroo。</p><p>这里是我的个人博客，用来记录生活、学习与创造。</p><p>关于我的更多介绍，之后慢慢补上。</p><h2>在别处找到我</h2><p><a href="https://github.com/hurroo7" target="_blank" rel="noopener noreferrer">GitHub / hurroo7 ↗</a></p></article>'))
write('projects/index.html','项目',page('项目','III · PROJECTS','<div class="empty"><p>这一章，留给正在发生的创造。</p><p>项目整理中，先去 <a href="https://github.com/hurroo7">GitHub</a> 看看。</p></div>'))
archive = ''.join(f'<a class="archive-row" href="/posts/{slug}/"><time>{escape(meta["date"])}</time><span>{escape(meta["title"])}</span></a>' for slug,meta in posts)
write('archives/index.html','归档',page('归档','V · ARCHIVE',archive))
write('404.html','未找到这一页',page('这一页，还没有写下','404','<div class="empty"><a href="/">回到目录，重新翻阅 ↗</a></div>'))
(OUT / '.nojekyll').touch()
print(f'Built {len(posts)} post(s) into {OUT}')
