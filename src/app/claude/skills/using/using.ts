import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-skills-using',
  imports: [CodeBlock, RouterLink],
  templateUrl: './using.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeSkillsUsing {
  protected readonly plugin = `/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills`;

  protected readonly invoke = `# запрос подошёл под описание — Claude сам возьмёт summarize-changes
> Что я поменял с последнего коммита?

> /summarize-changes      # вызвать вручную
> /fix-issue 1234         # аргумент придёт в $ARGUMENTS
> /document-skills:pdf    # скилл из плагина
> /skills                 # список скиллов, вкл/выкл`;

  protected readonly manualOnly = `---
name: deploy
description: Выкатывает приложение на прод.
disable-model-invocation: true
---`;

  protected readonly api = `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 4096,
  container: {
    skills: [
      { type: 'anthropic', skill_id: 'xlsx', version: 'latest' },
      // свой скилл: id выдаётся при загрузке
      { type: 'custom', skill_id: 'skill_01Ab', version: 'latest' },
    ],
  },
  // скиллы работают внутри песочницы code execution
  tools: [
    { type: 'code_execution_20250825', name: 'code_execution' },
  ],
  messages: [
    { role: 'user', content: 'Продажи по месяцам с графиком' },
  ],
});`;

  protected readonly upload = `curl https://api.anthropic.com/v1/skills \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -F "files[]=@report/SKILL.md;filename=report/SKILL.md"`;
}
