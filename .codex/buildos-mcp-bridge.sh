#!/bin/zsh
# .codex/buildos-mcp-bridge.sh

set -eu

BUILDOS_AGENT_TOKEN="$(/usr/bin/security find-generic-password \
	-a "$USER" \
	-s "codex-buildos-agent-token" \
	-w)"

export BUILDOS_AGENT_TOKEN
export BUILDOS_BASE_URL="https://build-os.com"
export BUILDOS_MCP_PROFILE="general"

exec /opt/homebrew/bin/node \
	/Users/djwayne/buildos-platform/packages/buildos-mcp-server/dist/index.js
