import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-api-managed-agents',
  imports: [CodeBlock, RouterLink],
  templateUrl: './managed-agents.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeApiManagedAgents {
  protected readonly setup = `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// окружение — шаблон контейнера, в котором выполняются инструменты агента
const environment = await client.beta.environments.create({
  name: "code-review",
  config: {
    type: "cloud",
    networking: { type: "limited", allow_package_managers: true }, // наружу — только реестры пакетов
  },
});

// агент — модель, промпт и инструменты; создаётся один раз, дальше только обновляется
const agent = await client.beta.agents.create({
  name: "Code Reviewer",
  model: "claude-opus-5-5",
  system: "Ты ревьюер кода. Найди ошибки, прогони тесты, предложи исправления.",
  tools: [
    {
      type: "agent_toolset_20260401", // bash, read, write, edit, glob, grep, web_fetch, web_search
      default_config: { enabled: true, permission_policy: { type: "auto" } },
      configs: [
        { name: "web_fetch", enabled: false }, // веб этому агенту не нужен
        { name: "web_search", enabled: false },
      ],
    },
  ],
});

console.log(environment.id, agent.id); // сохраните ID в конфиг — при каждом запуске они те же`;

  protected readonly session = `const session = await client.beta.sessions.create({
  agent: AGENT_ID,
  environment_id: ENVIRONMENT_ID,
  resources: [
    {
      type: "github_repository",
      url: "https://github.com/acme/shop",
      mount_path: "/workspace/shop",
      authorization_token: process.env.GITHUB_TOKEN,
    },
  ],
});

// сначала открываем поток событий, потом отправляем задачу
const stream = await client.beta.sessions.events.stream(session.id);
await client.beta.sessions.events.send(session.id, {
  events: [{ type: "user.message", content: [{ type: "text", text: "Проверь модуль оплаты" }] }],
});

loop: for await (const event of stream) {
  switch (event.type) {
    case "agent.message": // текст агента
      for (const block of event.content) {
        if (block.type === "text") process.stdout.write(block.text);
      }
      break;
    case "agent.tool_use": // вызов инструмента; ask — сервер ждёт вашего решения
      if (event.evaluated_permission === "ask") {
        await client.beta.sessions.events.send(session.id, {
          events: [{ type: "user.tool_confirmation", tool_use_id: event.id, result: "deny" }],
        });
      }
      break;
    case "session.status_idle": // агент остановился
      if (event.stop_reason.type !== "requires_action") break loop; // задача сделана
      break;
    case "session.status_terminated":
      break loop;
  }
}`;
}
