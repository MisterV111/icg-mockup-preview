#!/bin/bash
# Rebuild the lead magnet toolkit: regenerate PDF → rebuild bundle → commit → push
# Usage: ./rebuild-toolkit.sh "commit message"

set -e
cd "$(dirname "$0")"

MSG="${1:-Update toolkit PDF and rebuild bundle}"

echo "📄 Regenerating PDF..."
python3 generate-lead-magnet-pdf.py

echo "📦 Rebuilding bundle ZIP..."
BASEDIR="$(cd "$(dirname "$0")" && pwd)"
rm -f "$BASEDIR/assets/downloads/ai-image-toolkit-2026.zip"
TMPDIR=$(mktemp -d)
unzip -q "$BASEDIR/assets/downloads/image-prompt-engineer-skill.zip" -d "$TMPDIR/image-prompt-engineer-skill"
cp "$BASEDIR/assets/downloads/prompt-engineering-toolkit-2026.pdf" "$TMPDIR/"
cd "$TMPDIR"
zip -rq "$BASEDIR/assets/downloads/ai-image-toolkit-2026.zip" prompt-engineering-toolkit-2026.pdf image-prompt-engineer-skill/
rm -rf "$TMPDIR"
cd "$BASEDIR"

echo "📊 Bundle size: $(du -h assets/downloads/ai-image-toolkit-2026.zip | cut -f1)"

echo "🚀 Committing and pushing..."
git add -A
git commit -m "$MSG"
git push

echo "✅ Done — PDF + bundle live on production."
