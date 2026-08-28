from pathlib import Path
import re

TOOLS = Path("tools")
TARGETS = [
    "1. Keyword Research",
    "2. On-Page SEO",
    "3. High-Quality Content",
    "4. Internal and External Links",
    "5. Image Optimization",
    "6. Mobile Optimization",
    "7. User Experience (UX)",
    "8. Social Media Integration",
    "9. Monitor Performance",
    "10. Local SEO (if applicable)",
    "Python Code for Age Calculator",
    "Code Ka Istemal Karne Ka Tariqa:",
    "Example:",
    "Vision",
    "Upload File",
    "Invite & Earn",
]


def remove_container_blocks(text: str) -> str:
    # Remove complete section/article containers that contain multiple known
    # unrelated headings. This keeps navigation headings such as Search.
    changed = True
    while changed:
        changed = False
        for tag in ("section", "article"):
            pattern = re.compile(
                rf"<(?P<tag>{tag})\b[^>]*>(?P<body>.*?)</{tag}>",
                re.I | re.S,
            )

            def repl(match):
                nonlocal changed
                body = match.group("body")
                hits = sum(1 for target in TARGETS if target.lower() in body.lower())
                if hits >= 2:
                    changed = True
                    return ""
                return match.group(0)

            text = pattern.sub(repl, text)

    # Fallback for unwrapped headings. Do not remove generic Search/Pages/etc.
    for target in TARGETS:
        heading = re.compile(
            rf"<h[1-6]\b[^>]*>\s*{re.escape(target)}\s*</h[1-6]>",
            re.I | re.S,
        )
        text = heading.sub("", text)
    return text


def main():
    changed = []
    if not TOOLS.exists():
        return
    for path in TOOLS.glob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        cleaned = remove_container_blocks(text)
        if cleaned != text:
            path.write_text(cleaned, encoding="utf-8")
            changed.append(str(path))
    print(f"Cleaned polluted tool pages: {len(changed)}")
    for path in changed:
        print(path)


if __name__ == "__main__":
    main()
