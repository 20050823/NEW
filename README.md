# 记忆 / Memory

File-based memory workflow for Codex. The plugin reviews the visible conversation and project context, proposes content for global and current-project memory, then writes to `AGENTS.md` / `CLAUDE.md` only after the user confirms the scope.

## Behavior

- `@memory` / `@记忆` starts the review workflow immediately.
- The first response shows proposed content before asking where to write.
- The user chooses:
  - `1` current project memory
  - `2` global memory
  - `3` both
  - `4` do not write
- Writes use ordinary file editing after confirmation.

## Storage

- Current project: workspace `AGENTS.md` and `CLAUDE.md`
- Global: `C:\Users\30526\Documents\Codex\AGENTS.md`

## Design Rules

- Keep user-facing responses compact.
- Do not mention MCP or tool availability diagnostics unless the user asks.
- Do not write before showing proposed memory content and receiving explicit scope confirmation.
- Put durable cross-project preferences in global memory.
- Put paths, task facts, and project-specific context in current project memory.

## Files

- `.codex-plugin/plugin.json`: plugin manifest
- `skills/memory/SKILL.md`: main workflow
- `skills/ji-yi/SKILL.md`: Chinese alias workflow
- `mcp/server.cjs`: optional MCP helper server
