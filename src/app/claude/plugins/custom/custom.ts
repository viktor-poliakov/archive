import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-plugins-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePluginsCustom {
  protected readonly tree = `my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── release-notes/
        └── SKILL.md`;

  protected readonly pluginJson = `{
  "name": "my-plugin",
  "description": "Скиллы и хуки нашей команды",
  "version": "1.0.0",
  "author": { "name": "Platform Team" }
}`;

  protected readonly skillMd = `---
name: release-notes
description: Пишет заметки к релизу по коммитам с последнего тега. Используй, когда просят release notes или changelog.
---

1. Возьми коммиты: git log $(git describe --tags --abbrev=0)..HEAD --oneline
2. Сгруппируй их: «Новое», «Исправления», «Прочее».
3. Пиши для пользователей — без хешей коммитов и имён веток.`;

  protected readonly run = `claude plugin validate ./my-plugin    # ✔ Validation passed
claude --plugin-dir ./my-plugin       # загрузить на одну сессию, без установки`;

  protected readonly session = `> /my-plugin:release-notes
> /reload-plugins                     # подхватить правки, не перезапуская сессию`;

  protected readonly scaffold = `$ claude plugin init my-tool          # заготовка в ~/.claude/skills/my-tool/, грузится в каждой сессии

# или пусть Claude спроектирует и проверит плагин сам
> /plugin install plugin-dev@claude-plugins-official
> /plugin-dev:create-plugin плагин с хуком, который гоняет prettier после каждой правки`;

  protected readonly migrate = `mkdir -p my-plugin/.claude-plugin     # и plugin.json, как выше
cp -r .claude/skills .claude/agents my-plugin/
mkdir -p my-plugin/hooks              # объект "hooks" из .claude/settings.json → my-plugin/hooks/hooks.json`;
}
