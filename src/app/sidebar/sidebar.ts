import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { NAV_SECTIONS } from '../nav/nav.data';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly router = inject(Router);

  protected readonly sections = NAV_SECTIONS;
  protected readonly collapsed = signal(false);

  /** Current URL, recomputed after every navigation. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** URL split into path segments, e.g. ['javascript', 'functions', 'basics']. */
  private readonly segments = computed(() => this.url().split('/').filter(Boolean));

  /** The section selected via its route, or null when on the root "all sections" view. */
  protected readonly activeSection = computed(() => {
    const segment = this.segments()[0];
    return this.sections.find((section) => section.id === segment) ?? null;
  });

  /** The currently selected child id (second URL segment), used to highlight its group. */
  protected readonly activeChildId = computed(() => this.segments()[1] ?? null);

  /**
   * Groups that are currently expanded. On navigation an effect resets this to
   * just the active group (the one holding the current page) — so the group we're
   * inside is open and the rest are collapsed. Manual toggles tweak the set and
   * persist until the next navigation.
   */
  private readonly expandedGroups = signal(new Set<string>());

  constructor() {
    effect(() => {
      const active = this.activeChildId();
      this.expandedGroups.set(active ? new Set([active]) : new Set<string>());
    });
  }

  isGroupCollapsed(childId: string): boolean {
    return !this.expandedGroups().has(childId);
  }

  toggleGroup(childId: string): void {
    this.expandedGroups.update((groups) => {
      const next = new Set(groups);
      if (next.has(childId)) {
        next.delete(childId);
      } else {
        next.add(childId);
      }
      return next;
    });
  }

  toggleCollapse(): void {
    this.collapsed.update((value) => !value);
  }

  showAllSections(): void {
    this.router.navigateByUrl('/');
  }
}
