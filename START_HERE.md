# Moving the tools work to Claude Code

## 1. Put the folder somewhere permanent
Unzip `tools_workbench_2026-10-09.zip` to:

    C:\Users\lenar\Documents\SCQualityGuild\tools_workbench

You can use another location, but keep it out of OneDrive if you can; syncing build output is slow. The folder holds:

- `CLAUDE.md`: Claude Code reads this automatically. It holds the house rules, how the generator works, and what must not break.
- `TASKS.md`: the full list: re-tagging, 55 new tools, 9 extensions.
- `generator/`: the site generator (from generator_2026-10-05_audit.zip).
- `reference/bok/`: the text of the six Bodies of Knowledge.

## 2. Open Claude Code in that folder
Use Claude Code from the Claude desktop app, or install it from claude.com/claude-code. Open it **with this folder as the working folder**, so it finds CLAUDE.md.

Claude Code needs **Python 3** to run the generator. If it isn't installed, Claude Code will tell you and can walk you through it. Browser checks use Playwright, which it can install too.

## 3. Paste this as the first message

    Read CLAUDE.md and TASKS.md. Then do the first job in CLAUDE.md: bring the generator's
    header, footer and menu in line with the live site (the Games dropdown, the new primer
    names), and prove it by rebuilding one existing tool page and diffing it against the
    live copy. Then do the re-tagging in TASKS.md section A and show me the list of mapping
    changes before rebuilding the Resources page. Stop there for my review.

After that, ask for the priority-1 tools in batches, for example: "Build the next five priority-1 tools from TASKS.md."

## 4. Getting it live
Claude Code ends each batch with an upload folder: only the changed files, plus `UPLOAD_MANIFEST.md`, which lists every file with its SHA-256. Either:

- upload those files yourself in cPanel (back up the old ones first), or
- tell your Cowork session "upload the tools batch in <folder>", and it will back up, upload and verify the files on the server the same way it has been doing.

## 5. Keep the project in step
When a batch goes live, tell the Cowork session so it can update `claude/RESOURCES_TOOL_GAPS.md` and the site state in the project. Claude Code can't see the claude.ai project.
