---
name: memory
description: Use when the user selects the Memory/记忆 plugin, mentions @memory or @记忆, asks to summarize project memory, sync lessons learned, improve AGENTS.md or CLAUDE.md, capture feedback from the current conversation, or create missing project memory files.
---

# 记忆

Use this skill to turn the current visible conversation and workspace context into durable file-based memory.

Memory is stored in ordinary guidance files, not in hidden platform memory:

- Current project memory: workspace `AGENTS.md` and `CLAUDE.md`
- Global memory: `C:\Users\30526\Documents\Codex\AGENTS.md`

## Default Trigger

If the user only selects the Memory/记忆 plugin, or only says `@memory` / `@记忆`, immediately start the default workflow. Do not ask what they want to do with the plugin.

## Default Workflow

1. Review the visible conversation and current workspace context.
2. Show proposed memory content before asking where to write it.
3. Use this concise response structure:
   - 建议写入范围
   - 全局记忆
   - 当前项目记忆
   - 选择提示
4. Ask the user to choose:
   - `1` 当前项目记忆
   - `2` 全局记忆
   - `3` 两者都写
   - `4` 不写入，只保留本次总结
5. Only after the user chooses `1`, `2`, or `3`, write files if a write path is available.
6. If the user chooses `4`, do not write anything.

Never ask the user to choose a write scope before showing the proposed memory content.

## Write Path

Use ordinary file editing as the normal write path.

After the user chooses `1`, `2`, or `3`, update the selected memory files with normal file editing tools such as `apply_patch`, shell writes, or equivalent workspace edit tools.

If no file editing tools are available, provide exact target paths and copy-ready Markdown content.

Do not stop to search for separate memory tools. Do not mention MCP/tool diagnostics in the user-facing answer unless the user explicitly asks about implementation.

## Response Style

Keep the first response compact. Match this shape:

```text
建议 两者都写，但内容分层：

全局记忆
写用户长期偏好，适用于以后所有项目：
- ...

当前项目记忆
写本项目的具体状态和约束：
- ...

如果只能写一种，我建议优先写 全局记忆，因为...

请选择写入范围：
1. 当前项目记忆
2. 全局记忆
3. 两者都写
4. 不写入，只保留本次总结
```

After writing, keep the response compact:

```text
已写入全局记忆文件：[path]

写入的规则包括：
- ...
```

## Scope Rules

Global memory may include only durable cross-project collaboration preferences. Do not put project paths, temporary experiment notes, task-specific facts, or one-off failures into global memory.

Current project memory may include workspace paths, project facts, task-specific lessons, repository conventions, and context that should help future work in this project.

When the user chooses both, split content by scope instead of duplicating everything into both places.

If current project memory is selected and `AGENTS.md` or `CLAUDE.md` is missing, create the missing file before writing when file editing tools are available.

## User Preferences To Preserve

- When permissions, dependency installs, network access, environment setup, or sandbox limits slow the task down, ask for permission directly instead of trying many workarounds.
- If a permission request times out in the automatic review layer, retry at most once. If it times out again, state that it is blocked at `auto_review` before reaching the user and provide the exact manual command.
- The user's preferred permission behavior is for shell escalation blocked by `auto_review` to fall back to direct manual user approval. If the toolchain cannot do that, explain the limitation and offer a manual command or full-access mode.
- Before editing code, understand the user's real intent.
- When the user asks a question, answer with analysis and a proposed modification plan first. Do not edit files just because a question was asked.
- Edit only after the user explicitly agrees, unless the user has already clearly requested implementation, writing, execution, or file changes.
- For projects and experiments, do not loop through low-value setup attempts. Request the needed approval directly.
- Keep documentation changes scoped to the user's requested goal.

## Memory Quality

Good memory entries are specific, actionable, durable, and short enough that future agents will read them.

Avoid vague summaries, emotional commentary, duplicate rules, one-off observations, and claims not supported by visible context.
