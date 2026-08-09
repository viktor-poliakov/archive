import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { NAV_SECTIONS } from '../nav/nav.data';

interface SectionRouteData {
  sectionId?: string;
  childId?: string;
  /** Second-level parent when the URL points at a third-level item. */
  groupId?: string;
}

@Component({
  selector: 'app-section-page',
  templateUrl: './section-page.html',
  styleUrl: './section-page.scss',
})
export class SectionPage {
  private readonly route = inject(ActivatedRoute);

  // Route `data` carries which section/child this URL maps to (see app.routes.ts).
  // It re-emits on every navigation, so the page updates when the route changes.
  private readonly data = toSignal(
    this.route.data as Observable<SectionRouteData>,
    { initialValue: {} as SectionRouteData },
  );

  protected readonly section = computed(() => {
    const id = this.data().sectionId;
    return NAV_SECTIONS.find((section) => section.id === id) ?? null;
  });

  // Set only for third-level pages: the submenu group the child belongs to.
  protected readonly group = computed(() => {
    const groupId = this.data().groupId;
    return this.section()?.children.find((c) => c.id === groupId) ?? null;
  });

  // Third-level children live under their group, second-level ones under the section.
  protected readonly child = computed(() => {
    const childId = this.data().childId;
    const siblings = this.group()?.children ?? this.section()?.children;
    return siblings?.find((c) => c.id === childId) ?? null;
  });
}
