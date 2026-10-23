import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-api-messages',
  imports: [CodeBlock, RouterLink],
  templateUrl: './messages.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeApiMessages {
  protected readonly install = `# TypeScript / JavaScript
npm install @anthropic-ai/sdk

# Python 3.10+
pip install anthropic

# ключ из Claude Console: platform.claude.com → API keys
export ANTHROPIC_API_KEY=your-api-key`;

  protected readonly firstRequest = `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // ключ берётся из ANTHROPIC_API_KEY

const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  system: "Ты помощник интернет-магазина. Отвечай коротко и по делу.",
  messages: [{ role: "user", content: "Чем доставка курьером отличается от самовывоза?" }],
});

// content — массив блоков: text, thinking, tool_use…
for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}
console.log(response.stop_reason, response.usage); // почему остановился и сколько токенов ушло`;

  protected readonly firstRequestPython = `import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "Чем доставка курьером отличается от самовывоза?"}],
)

print("".join(block.text for block in response.content if block.type == "text"))`;

  protected readonly curl = `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2026-10-21" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Привет, Claude"}]
  }'`;

  protected readonly response = `{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-5-5",
  "content": [
    { "type": "thinking", "thinking": "", "signature": "EqQBCgIYAh..." },
    { "type": "text", "text": "Курьер привезёт заказ к двери в выбранный интервал…" }
  ],
  "stop_reason": "end_turn",
  "stop_details": null,
  "usage": { "input_tokens": 38, "output_tokens": 412 }
}`;

  protected readonly dialog = `const messages: Anthropic.MessageParam[] = [{ role: "user", content: "Меня зовут Аня." }];

const first = await client.messages.create({ model: "claude-opus-5-5", max_tokens: 16000, messages });

// API ничего не помнит: ответ кладём в историю целиком и отправляем всё заново
messages.push({ role: "assistant", content: first.content });
messages.push({ role: "user", content: "Как меня зовут?" });

const second = await client.messages.create({ model: "claude-opus-5-5", max_tokens: 16000, messages });`;

  protected readonly stream = `const stream = client.messages.stream({
  model: "claude-opus-5-5",
  max_tokens: 64000,
  messages: [{ role: "user", content: "Напиши описание товара для карточки на маркетплейсе" }],
});

stream.on("text", (delta) => process.stdout.write(delta)); // текст по кусочкам, по мере генерации

const message = await stream.finalMessage(); // в конце — целое сообщение, как от create()
console.log(message.usage.output_tokens);`;

  protected readonly files = `import fs from "node:fs";

const invoice = fs.readFileSync("invoice.pdf").toString("base64");

const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  messages: [
    {
      role: "user",
      content: [
        { type: "image", source: { type: "url", url: "https://example.com/parcel.jpg" } },
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: invoice } },
        { type: "text", text: "Совпадает ли товар на фото с позициями в счёте?" },
      ],
    },
  ],
});`;

  protected readonly structured = `import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const Review = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  topics: z.array(z.string()),
  needsReply: z.boolean(),
});

const response = await client.messages.parse({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  messages: [{ role: "user", content: "Разбери отзыв: «Доставили быстро, но коробка помята»" }],
  output_config: { format: zodOutputFormat(Review) },
});

const review = response.parsed_output; // типизированный объект или null, если ответ не разобрался
if (review?.needsReply) console.log(review.topics);`;
}
