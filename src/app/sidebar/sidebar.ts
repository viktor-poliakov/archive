import { Component, computed, inject, signal } from '@angular/core';
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

  /** Child groups the user has manually collapsed. Groups are expanded by default. */
  private readonly collapsedGroups = signal(new Set<string>());

  isGroupCollapsed(childId: string): boolean {
    return this.collapsedGroups().has(childId);
  }

  toggleGroup(childId: string): void {
    this.collapsedGroups.update((groups) => {
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
