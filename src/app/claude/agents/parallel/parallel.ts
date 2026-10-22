import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-agents-parallel',
  imports: [CodeBlock, RouterLink],
  templateUrl: './parallel.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAgentsParallel {
  protected readonly worktree = `# терминал 1 — фича
claude --worktree feature-auth

# терминал 2 — баг, в своей копии файлов
claude --worktree fix-cart

# ветка из пул-реквеста
claude --worktree "#1234"

# вернуться к сохранённому worktree
claude --worktree feature-auth --resume`;

  protected readonly worktreeInclude = `.env
.env.local
config/secrets.json`;

  protected readonly background = `# экран со всеми фоновыми сессиями
claude agents

# запустить задачу в фоне, не открывая сессию
claude --bg "разберись, почему падает тест SettingsChangeDetector"

# внутри сессии
/bg      # увести текущую сессию в фон
/fork    # копия разговора — новая фоновая сессия`;

  protected readonly cloud = `# каждая команда — отдельная облачная сессия
claude --cloud "Почини нестабильный тест в auth.spec.ts"
claude --cloud "Обнови документацию API"

# забрать облачную сессию в терминал
claude --teleport`;

  protected readonly message = `Сообщи сессии в соседнем терминале, что миграция схемы готова
и колонка теперь называется tenant_id.`;

  protected readonly teams = `{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}`;
}
