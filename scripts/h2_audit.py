from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
import re

class HeadingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings = []
        self.current = None
        self.buf = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if re.fullmatch(r'h[1-6]', tag):
            self.current = tag
            self.buf = []

    def handle_data(self, data):
        if self.current:
            self.buf.append(data)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if self.current == tag:
            text = re.sub(r'\s+', ' ', ''.join(self.buf)).strip()
            self.headings.append((int(tag[1]), text))
            self.current = None
            self.buf = []


def audit(path):
    p = HeadingParser()
    p.feed(path.read_text(encoding='utf-8', errors='ignore'))
    h1 = [x for x in p.headings if x[0] == 1]
    h2 = [x for x in p.headings if x[0] == 2]
    counts = Counter(x[1].casefold() for x in h2 if x[1])
    duplicate_h2 = [text for text, n in counts.items() if n > 1]
    issues = []
    if len(h1) != 1:
        issues.append(f'H1 count={len(h1)}')
    if duplicate_h2:
        issues.append('duplicate H2: ' + ', '.join(duplicate_h2))
    prev = 1 if h1 else None
    jumps = []
    for level, text in p.headings:
        if prev is not None and level > prev + 1:
            jumps.append(f'H{prev}->H{level}: {text}')
        prev = level
    if jumps:
        issues.append('heading jump: ' + ' | '.join(jumps))
    return p.headings, h1, h2, duplicate_h2, issues

rows = []
for path in sorted(Path('.').rglob('*.html')):
    if any(x in path.parts for x in ('.git', 'node_modules')) or path.name == '404.html':
        continue
    headings, h1, h2, duplicate_h2, issues = audit(path)
    if len(h2) > 1 or issues:
        rows.append((path.as_posix(), len(h1), len(h2), duplicate_h2, issues))

lines = [
    '# H2 Audit Report',
    '',
    'Multiple H2 headings are valid HTML and are not automatically changed. Only duplicate H2 text, missing/extra H1, and invalid heading-level jumps are flagged.',
    '',
    f'Pages with multiple H2 headings: {sum(1 for r in rows if r[2] > 1)}',
    f'Pages with duplicate H2 text: {sum(1 for r in rows if r[3])}',
    f'Pages with heading-structure issues: {sum(1 for r in rows if r[4])}',
    '',
    '| Page | H1 | H2 | Duplicate H2 | Structure issue |',
    '|---|---:|---:|---|---|',
]
for path, h1n, h2n, dup, issues in rows:
    lines.append(f"| `{path}` | {h1n} | {h2n} | {'; '.join(dup) if dup else 'None'} | {'; '.join(issues) if issues else 'None'} |")

Path('H2_AUDIT_REPORT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('\n'.join(lines))
