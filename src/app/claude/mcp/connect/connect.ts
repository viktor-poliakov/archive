import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-mcp-connect',
  imports: [CodeBlock, RouterLink],
  templateUrl: './connect.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeMcpConnect {
  protected readonly remote = `# вход через OAuth: после добавления запустите /mcp в сессии
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# вход по токену: заголовок уходит с каждым запросом
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \\
  --header "Authorization: Bearer $GITHUB_TOKEN"`;

  protected readonly local = `# всё после -- — команда запуска самого сервера
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \\
  --dsn "postgresql://readonly:pass@localhost:5432/shop"

# ключ — через переменную окружения
claude mcp add --env AIRTABLE_API_KEY=key_xxx --transport stdio airtable \\
  -- npx -y airtable-mcp-server`;

  protected readonly scope = `# область project: сервер запишется в .mcp.json
claude mcp add --scope project --transport http sentry https://mcp.sentry.dev/mcp`;

  protected readonly mcpJson = `{
  "mcpServers": {
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "db": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub", "--dsn", "\${DATABASE_URL}"]
    }
  }
}`;

  protected readonly manage = `claude mcp list         # все серверы и их статус
claude mcp get sentry   # подробности одного
claude mcp remove db    # удалить вместе с сохранённым входом
claude mcp add-json api '{"type":"http","url":"https://mcp.example.com/mcp"}'`;

  protected readonly session = `> /mcp                                         # статус, вход, выключение
> Какие PR висят на мне?                       # инструменты Claude выберет сам
> Проверь @github:issue://123 и предложи фикс  # ресурс сервера, как файл
> /mcp__github__pr_review 456                  # промпт сервера как команда`;

  protected readonly api = `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Какие задачи висят на мне?' }],
  mcp_servers: [
    {
      type: 'url',
      name: 'tracker',
      url: 'https://mcp.example.com/mcp',
      // OAuth-токен получаете сами: API вход не проводит
      authorization_token: process.env.TRACKER_TOKEN,
    },
  ],
  // все инструменты сервера; отдельные можно включать и выключать
  tools: [{ type: 'mcp_toolset', mcp_server_name: 'tracker' }],
  betas: ['mcp-client-2025-11-20'],
});`;

  protected readonly sdk = `import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt: 'Какая ошибка чаще всего падала за сутки?',
  options: {
    mcpServers: {
      sentry: {
        type: 'http',
        url: 'https://mcp.sentry.dev/mcp',
        headers: { Authorization: \`Bearer \${process.env.SENTRY_TOKEN}\` },
      },
      db: {
        command: 'npx',
        args: ['-y', '@bytebase/dbhub', '--dsn', process.env.DATABASE_URL!],
      },
    },
    allowedTools: ['mcp__sentry__*', 'mcp__db__*'],
  },
})) {
  if (message.type === 'result' && message.subtype === 'success') {
    console.log(message.result);
  }
}`;
}
