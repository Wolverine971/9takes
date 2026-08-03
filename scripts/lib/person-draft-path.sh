#!/usr/bin/env bash
# scripts/lib/person-draft-path.sh
# Shared resolver for personality-blog draft filenames.
#
# Queue identifiers and frontmatter slugs are not guaranteed to preserve the
# filename's casing or separators (for example, `stableronaldo` maps to
# `Stable-Ronaldo.md`). Callers must treat an ambiguous normalized match as an
# error rather than guessing.

normalize_person_draft_key() {
	local value="${1:-}"
	LC_ALL=C printf '%s' "$value" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]'
}

resolve_person_draft_path() {
	local drafts_dir="${1:-}"
	local person="${2:-}"
	local person_base wanted path base key
	local -a exact_matches=()
	local -a matches=()

	if [[ -z "$drafts_dir" || -z "$person" ]]; then
		echo "resolve_person_draft_path requires <drafts-dir> <person>" >&2
		return 2
	fi

	person_base="$(basename "$person")"
	person_base="${person_base%.md}"
	wanted="$(normalize_person_draft_key "$person_base")"
	if [[ -z "$wanted" ]]; then
		echo "Cannot normalize empty person identifier: $person" >&2
		return 2
	fi

	while IFS= read -r path; do
		base="$(basename "$path" .md)"
		if [[ "$base" == "$person_base" ]]; then
			exact_matches+=("$path")
		fi
		key="$(normalize_person_draft_key "$base")"
		if [[ "$key" == "$wanted" ]]; then
			matches+=("$path")
		fi
	done < <(find "$drafts_dir" -maxdepth 1 -type f -name '*.md' -print | LC_ALL=C sort)

	if [[ "${#exact_matches[@]}" -eq 1 ]]; then
		printf '%s\n' "${exact_matches[0]}"
		return 0
	fi

	case "${#matches[@]}" in
		0)
			return 1
			;;
		1)
			printf '%s\n' "${matches[0]}"
			return 0
			;;
		*)
			echo "Ambiguous draft identifier '$person' matched ${#matches[@]} files:" >&2
			printf '  %s\n' "${matches[@]}" >&2
			return 2
			;;
	esac
}
