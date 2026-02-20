#!/bin/bash
# Rebuild the lead magnet toolkit: regenerate PDF → rebuild bundle → commit → push
# Usage: ./rebuild-toolkit.sh "commit message"

set -e
cd "$(dirname "$0")"

MSG="${1:-Update toolkit PDF and rebuild bundle}"

echo "📄 Regenerating PDF..."
python3 generate-lead-magnet-pdf.py

echo "📦 Rebuilding bundle ZIP..."
cd assets/downloads
rm -f ai-image-toolkit-2026.zip
TMPDIR=$(mktemp -d)
unzip -q image-prompt-engineer-skill.zip -d "$TMPDIR/image-prompt-engineer-skill"
cp prompt-engineering-toolkit-2026.pdf "$TMPDIR/"
cd "$TMPDIR"
zip -rq "$(dirname "$0")/../../assets/downloads/ai-image-toolkit-2026.zip" prompt-engineering-toolkit-2026.pdf image-prompt-engineer-skill/
rm -rf "$TMPDIR"
cd "$(dirname "$0")/../.."

echo "📊 Bundle size: $(du -h assets/downloads/ai-image-toolkit-2026.zip | cut -f1)"

echo "🚀 Committing and pushing..."
git add -A
git commit -m "$MSG"
git push

echo "✅ Done — PDF + bundle live on production."
