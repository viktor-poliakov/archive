import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-skills-custom',
  imports: [CodeBlock, RouterLink],
  templateUrl: './custom.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeSkillsCustom {
  protected readonly ask = `Оформи то, что мы сейчас сделали, скиллом weekly-report.
Пусть срабатывает, когда просят недельный отчёт.
Шаблон отчёта вынеси в отдельный файл template.md.`;

  protected readonly zip = `weekly-report.zip
└── weekly-report/       # папка — в корне архива, имя = name
    ├── SKILL.md
    └── template.md`;

  protected readonly summarizeChanges = `---
name: summarize-changes
description: Кратко пересказывает незакоммиченные изменения и отмечает риски. Используй, когда спрашивают, что поменялось, просят сообщение коммита или ревью диффа.
---

## Текущие изменения

!\`git diff HEAD\`

## Что сделать

Перескажи изменения выше в 2-3 пунктах. Затем перечисли риски:
нет обработки ошибок, захардкоженные значения, тесты, которые надо обновить.
Если дифф пустой, так и скажи.`;

  protected readonly fixIssue = `---
name: fix-issue
description: Чинит задачу из GitHub по её номеру.
argument-hint: "[issue-number]"
disable-model-invocation: true
---

1. Прочитай задачу: gh issue view $ARGUMENTS
2. Найди причину и исправь код.
3. Добавь тест, который падал бы без исправления.
4. Прогони тесты и закоммить с сообщением «fix #$ARGUMENTS».`;
}
