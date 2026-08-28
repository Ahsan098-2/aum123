"""Generate the article library without modifying individual tool pages.

The original content_quality_upgrade.py also injects a generic guide into every
HTML file under tools/. That behavior can overwrite or pollute hand-written
tool content, so the GitHub workflow uses this wrapper instead.
"""
from scripts.content_quality_upgrade import build_articles, update_blog


if __name__ == "__main__":
    articles = build_articles()
    changed = update_blog(articles)
    print(f"Articles generated/checked: {len(articles)}")
    print(f"Blog updated: {changed}")
