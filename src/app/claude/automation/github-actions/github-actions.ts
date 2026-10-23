import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../../code/code-block';

@Component({
  selector: 'app-claude-automation-github-actions',
  imports: [CodeBlock, RouterLink],
  templateUrl: './github-actions.html',
  styleUrls: ['../../../content/doc.scss'],
})
export class ClaudeAutomationGithubActions {
  protected readonly install = `# в папке репозитория; нужны права админа и gh, выполнивший gh auth login
claude
> /install-github-app`;

  protected readonly mention = `# .github/workflows/claude.yml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write   # нужен для входа через Claude GitHub App
      actions: read     # Claude видит результаты CI в PR
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}`;

  protected readonly comments = `@claude реализуй фичу по описанию задачи
@claude как лучше сделать авторизацию для этого эндпоинта?
@claude почини TypeError в компоненте дашборда`;

  protected readonly review = `name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment \${{ github.repository }}/pull/\${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'`;

  protected readonly schedule = `name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"   # 9:00 UTC каждый день
jobs:
  report:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: read
      id-token: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Сводка по вчерашним коммитам и открытым задачам"
          claude_args: |
            --model sonnet
            --max-turns 10
            --allowedTools "mcp__github__list_commits,mcp__github__list_issues"`;
}
