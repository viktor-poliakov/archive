import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-skills-what-is',
  imports: [CodeBlock, RouterLink],
  templateUrl: './what-is.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeSkillsWhatIs {
  protected readonly tree = `brand-guidelines/
├── SKILL.md            # описание и инструкция (обязателен)
├── colors.md           # справочник
├── templates/
│   └── slide.pptx      # шаблон
└── scripts/
    └── check_fonts.py  # скрипт: в контекст идёт только вывод`;

  protected readonly skillMd = `---
name: brand-guidelines
description: Оформляет слайды и документы по брендбуку. Используй, когда просят сделать что-то «в нашем стиле».
---

# Брендбук

1. Цвета и шрифты возьми из colors.md.
2. Презентации собирай на шаблоне templates/slide.pptx.
3. Перед сдачей запусти scripts/check_fonts.py и исправь всё, что он нашёл.`;
}
