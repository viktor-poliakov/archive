import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-practice-security',
  imports: [CodeBlock, RouterLink],
  templateUrl: './security.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePracticeSecurity {
  protected readonly sandbox = `{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowedDomains": ["registry.npmjs.org", "github.com"]
    },
    "credentials": {
      "files": [
        { "path": "~/.ssh", "mode": "deny" },
        { "path": "~/.aws/credentials", "mode": "deny" }
      ],
      "envVars": [
        { "name": "GITHUB_TOKEN", "mode": "deny" }
      ]
    }
  }
}`;

  protected readonly apiKey = `import Anthropic from '@anthropic-ai/sdk';

// ключ SDK берёт из переменной окружения ANTHROPIC_API_KEY
const client = new Anthropic();`;
}
