import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-api-caching',
  imports: [CodeBlock, RouterLink],
  templateUrl: './caching.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeApiCaching {
  protected readonly auto = `const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  cache_control: { type: "ephemeral" }, // граница кэша сама ставится на последний блок
  system: SUPPORT_RULES, // длинные правила поддержки, одинаковые для всех диалогов
  messages,
});`;

  protected readonly explicit = `const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  messages: [
    {
      role: "user",
      content: [
        // договор на 50 страниц — общий для всех вопросов: граница кэша сразу после него
        { type: "text", text: contract, cache_control: { type: "ephemeral" } },
        // вопрос каждый раз свой — он после границы и в кэш не идёт
        { type: "text", text: question },
      ],
    },
  ],
});`;

  protected readonly verify = `const { usage } = response;
console.log(usage.cache_creation_input_tokens); // записано в кэш — по цене ×1,25
console.log(usage.cache_read_input_tokens); // прочитано из кэша — ×0,1 и дешевле
console.log(usage.input_tokens); // остаток по обычной цене`;
}
