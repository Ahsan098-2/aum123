from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
tag='<script src="/catalog-home.js?v=1001" defer></script>'
if 'catalog-home.js' not in s:
    marker='</head>'
    if marker not in s: raise SystemExit('index.html has no </head>')
    s=s.replace(marker, '  '+tag+'\n'+marker, 1)
    p.write_text(s, encoding='utf-8')
    print('Injected catalog-home.js into index.html')
else:
    print('catalog-home.js already injected')
