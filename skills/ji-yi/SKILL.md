---
name: ji-yi
description: Alias for the Memory/记忆 workflow. Use when the selected plugin is 记忆, when the user mentions @记忆 or @memory, or when the user asks to write conversation or project lessons into AGENTS.md or CLAUDE.md.
---

# 记忆 Alias

This is an alias for the file-based Memory/记忆 workflow.

If the user only selects the plugin, says `@memory`, or says `@记忆`, immediately start the memory workflow:

1. Review visible conversation and workspace context.
2. Show proposed global and current-project memory content first.
3. Ask the user to choose `1` current project, `2` global, `3` both, or `4` do not write.
4. Write only after the user chooses `1`, `2`, or `3`.

Use ordinary file editing tools after confirmation. If no file editing tools are available, provide target paths and copy-ready Markdown.

Keep responses compact. Do not include diagnostics or implementation details unless the user asks.
