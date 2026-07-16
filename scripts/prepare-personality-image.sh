#!/usr/bin/env bash
# Generate the full and thumbnail WebP assets for one personality analysis portrait.
#
# Usage:
#   ./scripts/prepare-personality-image.sh <source-image> <enneagram-type> [Person-Name]
#
# Optional test override:
#   PERSONALITY_IMAGE_OUTPUT_ROOT=/tmp/types ./scripts/prepare-personality-image.sh ...

set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
	echo "Usage: $0 <source-image> <enneagram-type 1-9> [Person-Name]" >&2
	exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
	echo "cwebp is required. Install the WebP tools before running this script." >&2
	exit 1
fi

source_image="$1"
enneagram_type="$2"

if [[ ! -f "$source_image" ]]; then
	echo "Source image not found: $source_image" >&2
	exit 1
fi

if [[ ! "$enneagram_type" =~ ^[1-9]$ ]]; then
	echo "Enneagram type must be a single number from 1 through 9." >&2
	exit 1
fi

source_filename="$(basename "$source_image")"
default_name="${source_filename%.*}"
default_name="${default_name// /-}"
default_name="${default_name//_/-}"
person_name="${3:-$default_name}"
person_name="${person_name%.webp}"
person_name="${person_name%.png}"

if [[ -z "$person_name" || "$person_name" == s-* || ! "$person_name" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]]; then
	echo "Person-Name must be a filename-safe slug without a leading s-." >&2
	exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_root="${PERSONALITY_IMAGE_OUTPUT_ROOT:-$repo_root/static/types}"
output_dir="$output_root/${enneagram_type}s"
full_output="$output_dir/$person_name.webp"
thumbnail_output="$output_dir/s-$person_name.webp"

mkdir -p "$output_dir"

cwebp -quiet -preset picture -q 82 -m 6 -mt -sharp_yuv \
	-resize 1200 0 -resize_mode down_only \
	"$source_image" \
	-o "$full_output"

cwebp -quiet -preset picture -q 72 -m 6 -mt -sharp_yuv \
	-resize 480 0 -resize_mode down_only \
	"$source_image" \
	-o "$thumbnail_output"

echo "Created personality image assets:"
echo "  $full_output"
echo "  $thumbnail_output"

if command -v sips >/dev/null 2>&1; then
	sips -g pixelWidth -g pixelHeight "$full_output" "$thumbnail_output"
fi
