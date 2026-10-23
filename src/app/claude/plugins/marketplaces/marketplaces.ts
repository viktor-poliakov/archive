import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-plugins-marketplaces',
  imports: [CodeBlock, RouterLink],
  templateUrl: './marketplaces.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePluginsMarketplaces {
  protected readonly add = `> /plugin marketplace add your-org/plugins                 # GitHub owner/repo; #v1.2.0 — закрепить тег
> /plugin marketplace add https://gitlab.example.com/team/plugins.git
> /plugin marketplace add ./my-marketplace                 # локальная папка, путь начинается с ./
> /plugin marketplace list
> /plugin marketplace update team-tools                    # обновить список плагинов
> /plugin marketplace remove team-tools                    # удалит и все плагины из него`;

  protected readonly tree = `team-plugins/
├── .claude-plugin/
│   └── marketplace.json   # сам каталог
└── plugins/
    └── formatter/         # обычная папка плагина`;

  protected readonly marketplaceJson = `{
  "name": "team-tools",
  "owner": { "name": "Platform Team" },
  "plugins": [
    {
      "name": "formatter",
      "source": "./plugins/formatter",
      "description": "Форматер и линтер после каждой правки"
    },
    {
      "name": "deploy-helper",
      "source": { "source": "github", "repo": "your-org/deploy-helper" },
      "description": "Деплой на стенды"
    }
  ]
}`;

  protected readonly check = `claude plugin validate ./team-plugins          # ✔ Validation passed
claude plugin marketplace add ./team-plugins
claude plugin install formatter@team-tools`;

  protected readonly projectSettings = `{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": { "source": "github", "repo": "your-org/team-plugins" }
    }
  },
  "enabledPlugins": {
    "formatter@team-tools": true
  }
}`;
}
