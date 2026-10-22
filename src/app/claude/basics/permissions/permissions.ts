import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-basics-permissions',
  imports: [CodeBlock, RouterLink],
  templateUrl: './permissions.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeBasicsPermissions {
  protected readonly startMode = `claude --permission-mode plan           # начать в plan mode
claude --permission-mode acceptEdits    # сразу принимать правки файлов

# CI: выполнять только разрешённое, остальное молча отклонять
claude -p "прогони тесты" --permission-mode dontAsk --allowedTools "Bash(npm test)"`;

  protected readonly defaultMode = `{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}`;

  protected readonly rules = `{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)"
    ],
    "ask": [
      "Bash(git push *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}`;

  protected readonly dirs = `claude --add-dir ../shared-lib    # при запуске
/add-dir ../shared-lib            # внутри сессии`;

  protected readonly dirsSetting = `{
  "permissions": {
    "additionalDirectories": ["../shared-lib"]
  }
}`;
}
