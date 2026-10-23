import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-plugins-install',
  imports: [CodeBlock, RouterLink],
  templateUrl: './install.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudePluginsInstall {
  protected readonly session = `> /plugin                                                  # каталог: Discover, Installed, Marketplaces, Errors
> /plugin install commit-commands@claude-plugins-official  # карточка плагина: что он добавит, выбор области
> /commit-commands:commit                                  # проверка: скилл плагина с префиксом`;

  protected readonly shell = `claude plugin install commit-commands@claude-plugins-official  # по умолчанию область user
claude plugin install formatter@your-org --scope project
claude plugin list
claude plugin disable formatter@your-org
claude plugin uninstall formatter@your-org`;

  protected readonly marketplace = `> /plugin marketplace add anthropics/knowledge-work-plugins   # GitHub owner/repo, git-URL или локальная папка
> /plugin install sales@knowledge-work-plugins               # после @ — имя маркетплейса`;

  protected readonly lsp = `$ npm install -g typescript-language-server typescript   # сам языковой сервер, в плагин не входит
> /plugin install typescript-lsp@claude-plugins-official`;

  protected readonly sdk = `import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt: '/my-plugin:review',
  options: {
    // только локальные папки: плагин из маркетплейса сначала скачайте
    plugins: [{ type: 'local', path: './plugins/my-plugin' }],
  },
})) {
  console.log(message);
}`;
}
