import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-mcp-popular',
  imports: [CodeBlock, RouterLink],
  templateUrl: './popular.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeMcpPopular {
  protected readonly tasks = `# GitHub: PR, issues, Actions. Нужен personal access token
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \\
  --header "Authorization: Bearer $GITHUB_TOKEN"

# задачи: Linear; Jira и Confluence
claude mcp add --transport http linear https://mcp.linear.app/mcp
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp

# ошибки из продакшена
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`;

  protected readonly tasksPrompts = `> Возьми задачу ENG-4521 из Linear, сделай её и открой PR
> Почему упал CI в моём последнем PR? Поправь
> Разбери самую частую ошибку в Sentry за неделю и найди её причину в коде`;

  protected readonly browser = `# браузер: открыть страницу, кликать, заполнять формы
claude mcp add --transport stdio playwright -- npx @playwright/mcp@latest

# Chrome DevTools: консоль, сеть, трассировка производительности
claude mcp add --transport stdio chrome-devtools \\
  -- npx -y chrome-devtools-mcp@latest

# Figma: макеты, переменные, компоненты. Плагином — сразу со скиллами
claude plugin install figma@claude-plugins-official`;

  protected readonly browserPrompts = `> Открой localhost:4200, оформи тестовый заказ и скажи, где ломается
> Почему главная грузится 4 секунды? Сними трассировку в Chrome
> Сверстай этот экран по макету: https://www.figma.com/design/...`;

  protected readonly docs = `claude mcp add --transport http context7 https://mcp.context7.com/mcp`;

  protected readonly docsPrompt = `> Как подключить Vitest к Angular-проекту? use context7`;

  protected readonly data = `# PostgreSQL, MySQL, SQL Server, SQLite и др. — через DBHub
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \\
  --dsn "postgresql://readonly:pass@localhost:5432/shop"

# Notion: документы и базы знаний
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Stripe: платежи, клиенты, подписки
claude mcp add --transport http stripe https://mcp.stripe.com`;

  protected readonly dataPrompts = `> Сколько заказов было за неделю? Покажи схему таблицы orders
> Найди в Notion регламент релиза и проверь, что мы его соблюдаем`;
}
