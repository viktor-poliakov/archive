import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-agents-agent-sdk',
  imports: [CodeBlock, RouterLink],
  templateUrl: './agent-sdk.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAgentsAgentSdk {
  protected readonly install = `# TypeScript (Node.js 18+)
npm install @anthropic-ai/claude-agent-sdk
npm install --save-dev tsx

# Python 3.10+
pip install claude-agent-sdk

# ключ из Claude Console
export ANTHROPIC_API_KEY=your-api-key`;

  protected readonly firstAgent = `import { query } from "@anthropic-ai/claude-agent-sdk";

// агентный цикл: сообщения приходят по мере работы Claude
for await (const message of query({
  prompt: "Найди в utils.ts ошибки, из-за которых код может упасть, и исправь их",
  options: {
    allowedTools: ["Read", "Edit", "Glob"], // эти инструменты — без подтверждения
    permissionMode: "acceptEdits", // правки файлов — тоже
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "text") console.log(block.text); // рассуждения
      if (block.type === "tool_use") console.log(\`Tool: \${block.name}\`); // вызов инструмента
    }
  } else if (message.type === "result") {
    console.log(\`Done: \${message.subtype}\`); // success или причина остановки
  }
}`;

  protected readonly firstAgentPython = `import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage


async def main():
    async for message in query(
        prompt="Найди в utils.py ошибки, из-за которых код может упасть, и исправь их",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],
            permission_mode="acceptEdits",
        ),
    ):
        if isinstance(message, ResultMessage) and message.subtype == "success":
            print(message.result)


asyncio.run(main())`;

  protected readonly customTool = `import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// инструмент: имя, описание, схема аргументов, обработчик
const getOrder = tool(
  "get_order",
  "Возвращает статус заказа по номеру",
  { orderId: z.string().describe("Номер заказа") },
  async ({ orderId }) => {
    const order = await db.orders.find(orderId); // ваш код: БД, API, что угодно
    if (!order) {
      return { content: [{ type: "text", text: \`Заказ \${orderId} не найден\` }], isError: true };
    }
    return { content: [{ type: "text", text: JSON.stringify(order) }] };
  },
);

// MCP-сервер внутри вашего процесса
const shop = createSdkMcpServer({ name: "shop", version: "1.0.0", tools: [getOrder] });

for await (const message of query({
  prompt: "Почему заказ 1042 до сих пор не отправлен?",
  options: {
    mcpServers: { shop },
    allowedTools: ["mcp__shop__get_order"], // mcp__<сервер>__<инструмент>
  },
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}`;

  protected readonly agentsAndHooks = `import { query, type HookInput, type HookJSONOutput } from "@anthropic-ai/claude-agent-sdk";

// хук: проверяет команду до того, как она выполнится
const blockRmRf = async (input: HookInput): Promise<HookJSONOutput> => {
  if (input.hook_event_name !== "PreToolUse") return {};
  const { command } = input.tool_input as { command?: string };
  if (command?.includes("rm -rf")) {
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Опасная команда заблокирована",
      },
    };
  }
  return {}; // пустой объект — разрешить
};

for await (const message of query({
  prompt: "Проверь модуль авторизации на уязвимости и прогони тесты",
  options: {
    allowedTools: ["Read", "Grep", "Glob", "Bash", "Agent"], // Agent — чтобы звать субагентов
    agents: {
      "security-reviewer": {
        description: "Ищет уязвимости в коде. Используй для ревью безопасности.",
        prompt: "Ты ревьюер безопасности. Верни список проблем по важности, код не правь.",
        tools: ["Read", "Grep", "Glob"],
        model: "sonnet",
      },
    },
    hooks: { PreToolUse: [{ matcher: "Bash", hooks: [blockRmRf] }] },
    maxTurns: 30,
    maxBudgetUsd: 2,
  },
})) {
  if (message.type === "result") console.log(message.subtype, message.total_cost_usd);
}`;

  protected readonly sessions = `let sessionId: string | undefined;

for await (const message of query({
  prompt: "Разбери, как устроен модуль авторизации",
  options: { allowedTools: ["Read", "Grep", "Glob"] },
})) {
  if (message.type === "result") sessionId = message.session_id;
}

// продолжить тот же разговор: агент помнит всё, что уже прочитал
for await (const message of query({
  prompt: "Теперь переведи его на JWT",
  options: { resume: sessionId, allowedTools: ["Read", "Edit", "Grep", "Glob"] },
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}`;
}
