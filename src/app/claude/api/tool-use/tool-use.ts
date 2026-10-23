import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-api-tool-use',
  imports: [CodeBlock, RouterLink],
  templateUrl: './tool-use.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeApiToolUse {
  protected readonly definition = `const tools: Anthropic.Tool[] = [
  {
    name: "get_order_status",
    description:
      "Возвращает статус заказа по номеру. Вызывай, когда пользователь спрашивает, где его заказ.",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "Номер заказа, например 1042" },
      },
      required: ["orderId"],
      additionalProperties: false,
    },
    strict: true, // аргументы гарантированно совпадут со схемой
  },
];`;

  protected readonly manualLoop = `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ваш код: БД, внешний API, что угодно
async function runTool(name: string, input: unknown): Promise<string> {
  if (name === "get_order_status") {
    const { orderId } = input as { orderId: string };
    const order = await db.orders.find(orderId);
    if (!order) throw new Error(\`Заказ \${orderId} не найден\`);
    return JSON.stringify(order);
  }
  throw new Error(\`Нет инструмента \${name}\`);
}

const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "Почему заказ 1042 до сих пор не отправлен?" },
];

for (let step = 0; step < 10; step++) { // лимит шагов, чтобы цикл не крутился вечно
  const response = await client.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    tools,
    messages,
  });
  messages.push({ role: "assistant", content: response.content }); // ответ целиком, вместе с tool_use

  if (response.stop_reason !== "tool_use") {
    // end_turn — ответ готов (max_tokens, refusal — тоже выходим)
    for (const block of response.content) {
      if (block.type === "text") console.log(block.text);
    }
    break;
  }

  // вызовов может быть несколько: выполняем параллельно, результаты — одним сообщением
  const calls = response.content.filter((block) => block.type === "tool_use");
  const results = await Promise.all(
    calls.map(async (call): Promise<Anthropic.ToolResultBlockParam> => {
      try {
        const content = await runTool(call.name, call.input);
        return { type: "tool_result", tool_use_id: call.id, content };
      } catch (error) {
        // ошибку отдаём Claude: он прочитает текст и попробует по-другому
        return { type: "tool_result", tool_use_id: call.id, content: String(error), is_error: true };
      }
    }),
  );
  messages.push({ role: "user", content: results });
}`;

  protected readonly runner = `import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

const getOrderStatus = betaZodTool({
  name: "get_order_status",
  description: "Возвращает статус заказа по номеру. Вызывай, когда спрашивают, где заказ.",
  inputSchema: z.object({ orderId: z.string().describe("Номер заказа") }),
  run: async ({ orderId }) => JSON.stringify(await db.orders.find(orderId)),
});

// SDK сам крутит цикл: вызывает run(), отправляет результаты, повторяет
const finalMessage = await client.beta.messages.toolRunner({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  max_iterations: 10, // лимит шагов
  tools: [getOrderStatus],
  messages: [{ role: "user", content: "Почему заказ 1042 до сих пор не отправлен?" }],
});

for (const block of finalMessage.content) {
  if (block.type === "text") console.log(block.text);
}`;

  protected readonly serverTools = `const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  tools: [
    { type: "web_search_20260209", name: "web_search", max_uses: 5 },
    { type: "web_fetch_20260209", name: "web_fetch" },
  ],
  messages: [{ role: "user", content: "Что нового в последней версии TypeScript?" }],
});

// поиск и чтение страниц уже сделаны на стороне Anthropic — в ответе готовый текст
for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}`;
}
