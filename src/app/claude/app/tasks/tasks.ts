import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-app-tasks',
  imports: [CodeBlock, RouterLink],
  templateUrl: './tasks.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAppTasks {
  protected readonly taskPrompts = `Разбери папку «Загрузки»: разложи файлы по типам и датам,
дубликаты — в отдельную папку.

В папке «Чеки» сканы за сентябрь. Сделай из них отчёт о расходах в Excel
с итогами по категориям.

Вот расшифровки трёх встреч с клиентом. Собери отчёт: решения,
открытые вопросы, кто что делает.`;

  protected readonly schedulePrompts = `Каждый понедельник в 9:00 подводи итоги прошлой недели
по каналам нашей команды в Slack.

По будням в 8:30 — сводка: новые важные письма, встречи на сегодня,
задачи с дедлайном на этой неделе.

Раз в неделю собирай новости о трёх наших конкурентах
и дописывай их в таблицу в Google Drive.`;
}
