import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-automation-headless',
  imports: [CodeBlock, RouterLink],
  templateUrl: './headless.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAutomationHeadless {
  protected readonly basics = `# вопрос — ответ в stdout
claude -p "Что делает модуль auth?"

# данные через pipe, ответ в файл
cat build-error.txt | claude -p "Коротко объясни причину ошибки сборки" > output.txt

# скилл или своя команда — прямо в тексте задачи
claude -p "/review-pr 123"`;

  protected readonly permissions = `# коммит: разрешены только нужные git-команды
claude -p "Посмотри staged-изменения и сделай коммит" \\
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"

# правки файлов без вопросов, остальное — по правилам
claude -p "Исправь ошибки линтера" --permission-mode acceptEdits`;

  protected readonly json = `# только текст ответа
claude -p "Кратко опиши проект" --output-format json | jq -r '.result'

# ответ по JSON Schema — в поле structured_output
claude -p "Выпиши имена функций из auth.py" \\
  --output-format json \\
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \\
  | jq '.structured_output.functions'`;

  protected readonly resume = `claude -p "Найди узкие места в производительности"
claude -p "Теперь только запросы к базе" --continue   # последний разговор

# конкретный разговор — по session_id
id=$(claude -p "Начни ревью" --output-format json | jq -r '.session_id')
claude -p "Продолжи ревью" --resume "$id"`;

  protected readonly bare = `export ANTHROPIC_API_KEY=sk-ant-...
claude --bare -p "Кратко перескажи README.md" --allowedTools "Read"

# нужное подключается флагами
claude --bare -p "Проверь миграции" \\
  --settings ./ci/settings.json \\
  --mcp-config ./ci/mcp.json \\
  --append-system-prompt-file ./ci/rules.md`;

  protected readonly npmScript = `{
  "scripts": {
    "lint:claude": "git diff main | claude -p \\"Ты линтер опечаток. Для каждой опечатки в диффе выведи файл:строка и суть ошибки. Больше ничего.\\""
  }
}`;

  protected readonly review = `#!/bin/bash
# review.sh 123 — ревью безопасности пул-реквеста №123
gh pr diff "$1" | claude -p \\
  --append-system-prompt "Ты специалист по безопасности. Ищи уязвимости." \\
  --max-budget-usd 2 \\
  --output-format json | jq -r '.result'`;
}
