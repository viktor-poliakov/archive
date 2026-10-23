import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-plugins-what-is',
  imports: [CodeBlock, RouterLink],
  templateUrl: './what-is.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePluginsWhatIs {
  protected readonly tree = `my-plugin/
├── .claude-plugin/
│   └── plugin.json      # манифест: имя, версия, описание
├── skills/
│   └── review/
│       └── SKILL.md     # скилл → /my-plugin:review
├── agents/
│   └── reviewer.md      # субагент → my-plugin:reviewer
├── hooks/
│   └── hooks.json       # хуки: например, форматер после каждой правки
└── .mcp.json            # MCP-серверы`;
}
