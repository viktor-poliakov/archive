import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-automation-scheduled',
  imports: [CodeBlock, RouterLink],
  templateUrl: './scheduled.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAutomationScheduled {
  protected readonly loop = `> /loop 5m проверь, закончился ли деплой, и расскажи, что случилось
> /loop проверь, прошёл ли CI, и разбери новые комментарии ревью
> /loop 20m /review-pr 1234
> /loop`;

  protected readonly remind = `> напомни в 15:00 запушить релизную ветку
> через 45 минут проверь, прошли ли интеграционные тесты
> какие у меня запланированы задачи?
> отмени проверку деплоя`;

  protected readonly desktop = `> каждое утро в 9 делай ревью вчерашних коммитов
> по будням в 18:00 проверяй устаревшие зависимости и пиши отчёт в reports/
> в понедельник в 9:00 сведи PR, смёрженные с пятницы`;

  protected readonly cloud = `> /schedule каждый будний день в 9:07 — ревью вчерашних PR
> /schedule через 2 недели открой PR, который удаляет фича-флаг new-checkout
> /schedule list
> /schedule run
> /schedule почему ночное ревью сегодня ничего не сделало?`;

  protected readonly fire = `curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_01ABCDEFGHJKLMNOPQRSTUVW/fire \\
  -H "Authorization: Bearer sk-ant-oat01-xxxxx" \\
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Sentry: алерт SEN-4521 в проде, стектрейс ниже."}'`;

  protected readonly cron = `# crontab -e — по будням в 9:00, на своём сервере
0 9 * * 1-5 cd /srv/shop && claude --bare -p "Разбери логи за ночь, выпиши ошибки" --allowedTools "Read" >> /var/log/claude-daily.md 2>&1`;
}
