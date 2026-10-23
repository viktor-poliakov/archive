import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-mcp-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeMcpCustom {
  protected readonly setup = `mkdir cbr-rates && cd cbr-rates
npm init -y
npm pkg set type=module
npm install @modelcontextprotocol/server zod`;

  protected readonly server = `// server.ts
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

type Rate = { Nominal: number; Name: string; Value: number };
type Rates = { Date: string; Valute: Record<string, Rate> };

// фабрика: SDK создаёт свежий экземпляр сервера на каждое подключение
function createServer() {
  const server = new McpServer({ name: 'cbr-rates', version: '1.0.0' });

  server.registerTool(
    'get_rate',
    {
      // описание читает модель: когда вызывать и что передать
      description:
        'Официальный курс валюты к рублю от ЦБ РФ на сегодня. ' +
        'Вызывай, когда нужен курс или пересчёт суммы в рубли.',
      inputSchema: z.object({
        code: z.string().length(3).describe('ISO-код валюты: USD, EUR, CNY'),
      }),
    },
    async ({ code }) => {
      const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
      const data = (await res.json()) as Rates;
      const rate = data.Valute[code.toUpperCase()];
      if (!rate) {
        // ошибка — обычный ответ: модель прочитает его и попробует иначе
        const text = \`Валюта \${code} не найдена\`;
        return { content: [{ type: 'text', text }], isError: true };
      }
      const date = data.Date.slice(0, 10);
      const text = \`\${rate.Nominal} \${rate.Name} = \${rate.Value} ₽ на \${date}\`;
      return { content: [{ type: 'text', text }] };
    },
  );

  return server;
}

// логи — только в stderr: stdout занят протоколом
console.error('cbr-rates запущен');
serveStdio(createServer);`;

  protected readonly connect = `# путь к файлу — абсолютный
claude mcp add --transport stdio cbr-rates -- node /home/me/cbr-rates/server.ts`;

  protected readonly session = `> /mcp   # у cbr-rates статус Connected и один инструмент
> Сколько будет 250 долларов в рублях по курсу ЦБ?`;

  protected readonly inspector = `npx @modelcontextprotocol/inspector node server.ts`;

  protected readonly httpInstall = `npm install @modelcontextprotocol/node`;

  protected readonly http = `import { createServer as createHttpServer } from 'node:http';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';

// вместо serveStdio: та же фабрика createServer, но по HTTP
const handler = createMcpHandler(createServer);
createHttpServer(toNodeHandler(handler)).listen(3000);`;

  protected readonly httpConnect = `claude mcp add --transport http cbr-rates http://localhost:3000/mcp`;
}
