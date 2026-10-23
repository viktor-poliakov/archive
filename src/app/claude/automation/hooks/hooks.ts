import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-automation-hooks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './hooks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAutomationHooks {
  protected readonly format = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}`;

  protected readonly input = `{
  "session_id": "abc123",
  "cwd": "/home/me/shop",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}`;

  protected readonly protectScript = `#!/bin/bash
# .claude/hooks/protect-files.sh
FILE_PATH=$(jq -r '.tool_input.file_path // empty')
FILE_PATH="\${FILE_PATH//\\\\//}"   # обратные слеши Windows → прямые

for pattern in ".env" "package-lock.json" ".git/"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Нельзя менять $FILE_PATH: защищённый файл" >&2   # это прочитает Claude
    exit 2                                              # 2 = заблокировать
  fi
done
exit 0`;

  protected readonly protectConfig = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/protect-files.sh" }
        ]
      }
    ]
  }
}`;

  protected readonly notify = `{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt|idle_prompt",
        "hooks": [
          { "type": "command", "command": "notify-send 'Claude Code' 'Нужен ваш ответ'" }
        ]
      }
    ]
  }
}`;

  protected readonly compact = `{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          { "type": "command", "command": "echo 'Пакетный менеджер — pnpm. Перед коммитом: pnpm test.'; git log --oneline -5" }
        ]
      }
    ]
  }
}`;

  protected readonly stopCheck = `{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Все ли задачи пользователя выполнены? Если нет, ответь {\\"ok\\": false, \\"reason\\": \\"что осталось\\"}."
          }
        ]
      }
    ]
  }
}`;
}
