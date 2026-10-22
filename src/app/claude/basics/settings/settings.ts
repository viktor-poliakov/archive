import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-settings',
  imports: [CodeBlock, RouterLink],
  templateUrl: './settings.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsSettings {
  protected readonly commands = `# внутри сессии
/config                  # меню личных настроек: тема, vim-режим и т.п.
/config verbose=true     # поменять одну опцию без меню
/status                  # какие файлы настроек загружены

# при запуске
claude --settings '{"model": "opus"}'   # настройка только на эту сессию
claude doctor                           # показать ошибки в настройках`;

  protected readonly personal = `{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "sonnet",
  "language": "russian",
  "spinnerTipsEnabled": false,
  "cleanupPeriodDays": 30,
  "permissions": {
    "allow": ["Bash(git diff *)"]
  }
}`;

  protected readonly team = `{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)", "Read(./secrets/**)"]
  },
  "env": {
    "NODE_ENV": "development"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/check-command.sh" }
        ]
      }
    ]
  }
}`;
}
