import { Route, Routes } from '@angular/router';

import { NavChild, NAV_SECTIONS, NavSection } from './nav/nav.data';
import { SectionPage } from './section-page/section-page';

// Submenu items that have a real, dedicated page instead of the mock SectionPage.
// Keyed by full path ("<section>/<child>" or "<section>/<child>/<sub>"); lazily
// loaded so content pages stay out of the initial bundle. Add an entry here as
// each topic gets real content.
const PAGE_OVERRIDES: Record<string, Route['loadComponent']> = {
  javascript: () => import('./javascript/javascript').then((m) => m.JavascriptOverview),
  'javascript/variables': () =>
    import('./variables/variables').then((m) => m.Variables),
  'javascript/types': () =>
    import('./types/types').then((m) => m.Types),
  'javascript/hoisting': () =>
    import('./hoisting/hoisting').then((m) => m.Hoisting),
  'javascript/functions/basics': () =>
    import('./functions/basics/basics').then((m) => m.FunctionsBasics),
  'javascript/functions/declarations': () =>
    import('./functions/declarations/declarations').then((m) => m.FunctionsDeclarations),
  'javascript/functions/parameters': () =>
    import('./functions/parameters/parameters').then((m) => m.FunctionsParameters),
  'javascript/functions/first-class': () =>
    import('./functions/first-class/first-class').then((m) => m.FunctionsFirstClass),
  'javascript/functions/properties': () =>
    import('./functions/properties/properties').then((m) => m.FunctionsProperties),
  'javascript/functions/this': () =>
    import('./functions/this/this').then((m) => m.FunctionsThis),
  'javascript/functions/pure': () =>
    import('./functions/pure/pure').then((m) => m.FunctionsPure),
  'javascript/functions/pitfalls': () =>
    import('./functions/pitfalls/pitfalls').then((m) => m.FunctionsPitfalls),
  'javascript/closures/basics': () =>
    import('./closures/basics/basics').then((m) => m.ClosuresBasics),
  'javascript/closures/lexical-environment': () =>
    import('./closures/lexical-environment/lexical-environment').then((m) => m.ClosuresLexicalEnvironment),
  'javascript/closures/practical': () =>
    import('./closures/practical/practical').then((m) => m.ClosuresPractical),
  'javascript/closures/pitfalls': () =>
    import('./closures/pitfalls/pitfalls').then((m) => m.ClosuresPitfalls),
  'javascript/objects/basics': () =>
    import('./objects/basics/basics').then((m) => m.ObjectsBasics),
  'javascript/objects/methods': () =>
    import('./objects/methods/methods').then((m) => m.ObjectsMethods),
  'javascript/objects/iteration': () =>
    import('./objects/iteration/iteration').then((m) => m.ObjectsIteration),
  'javascript/objects/references': () =>
    import('./objects/references/references').then((m) => m.ObjectsReferences),
  'javascript/objects/destructuring': () =>
    import('./objects/destructuring/destructuring').then((m) => m.ObjectsDestructuring),
  'javascript/objects/prototypes': () =>
    import('./objects/prototypes/prototypes').then((m) => m.ObjectsPrototypes),
  'javascript/objects/pitfalls': () =>
    import('./objects/pitfalls/pitfalls').then((m) => m.ObjectsPitfalls),
  'javascript/arrays/basics': () =>
    import('./arrays/basics/basics').then((m) => m.ArraysBasics),
  'javascript/arrays/add-remove': () =>
    import('./arrays/add-remove/add-remove').then((m) => m.ArraysAddRemove),
  'javascript/arrays/iteration': () =>
    import('./arrays/iteration/iteration').then((m) => m.ArraysIteration),
  'javascript/arrays/search': () =>
    import('./arrays/search/search').then((m) => m.ArraysSearch),
  'javascript/arrays/transform': () =>
    import('./arrays/transform/transform').then((m) => m.ArraysTransform),
  'javascript/arrays/pitfalls': () =>
    import('./arrays/pitfalls/pitfalls').then((m) => m.ArraysPitfalls),
  'javascript/context/basics': () =>
    import('./context/basics/basics').then((m) => m.ContextBasics),
  'javascript/context/binding-rules': () =>
    import('./context/binding-rules/binding-rules').then((m) => m.ContextBindingRules),
  'javascript/context/default-binding': () =>
    import('./context/default-binding/default-binding').then((m) => m.ContextDefaultBinding),
  'javascript/context/losing-context': () =>
    import('./context/losing-context/losing-context').then((m) => m.ContextLosingContext),
  'javascript/context/call-apply-bind': () =>
    import('./context/call-apply-bind/call-apply-bind').then((m) => m.ContextCallApplyBind),
  'javascript/context/arrow': () =>
    import('./context/arrow/arrow').then((m) => m.ContextArrow),
  'javascript/context/classes-new': () =>
    import('./context/classes-new/classes-new').then((m) => m.ContextClassesNew),
  'javascript/classes/basics': () =>
    import('./classes/basics/basics').then((m) => m.ClassesBasics),
  'javascript/classes/static-private': () =>
    import('./classes/static-private/static-private').then((m) => m.ClassesStaticPrivate),
  'javascript/classes/inheritance': () =>
    import('./classes/inheritance/inheritance').then((m) => m.ClassesInheritance),
  'javascript/classes/under-the-hood': () =>
    import('./classes/under-the-hood/under-the-hood').then((m) => m.ClassesUnderTheHood),
  'javascript/prototypes/basics': () =>
    import('./prototypes/basics/basics').then((m) => m.PrototypesBasics),
  'javascript/prototypes/proto-vs-prototype': () =>
    import('./prototypes/proto-vs-prototype/proto-vs-prototype').then((m) => m.PrototypesProtoVsPrototype),
  'javascript/prototypes/chain': () =>
    import('./prototypes/chain/chain').then((m) => m.PrototypesChain),
  'javascript/event-loop/basics': () =>
    import('./event-loop/basics/basics').then((m) => m.EventLoopBasics),
  'javascript/event-loop/macro-micro': () =>
    import('./event-loop/macro-micro/macro-micro').then((m) => m.EventLoopMacroMicro),
  'javascript/event-loop/rendering': () =>
    import('./event-loop/rendering/rendering').then((m) => m.EventLoopRendering),
  'javascript/event-loop/pitfalls': () =>
    import('./event-loop/pitfalls/pitfalls').then((m) => m.EventLoopPitfalls),
  'javascript/events/basics': () =>
    import('./events/basics/basics').then((m) => m.EventsBasics),
  'javascript/events/propagation': () =>
    import('./events/propagation/propagation').then((m) => m.EventsPropagation),
  'javascript/events/target': () =>
    import('./events/target/target').then((m) => m.EventsTarget),
  'javascript/events/delegation': () =>
    import('./events/delegation/delegation').then((m) => m.EventsDelegation),
  'javascript/events/custom-events': () =>
    import('./events/custom-events/custom-events').then((m) => m.EventsCustomEvents),
  'javascript/events/pitfalls': () =>
    import('./events/pitfalls/pitfalls').then((m) => m.EventsPitfalls),
};

// A leaf route: a real content page if registered in PAGE_OVERRIDES, otherwise
// the mock SectionPage that reads `data` to know what to render.
function leafRoute(path: string, section: NavSection, child: NavChild): Route {
  const loadComponent = PAGE_OVERRIDES[path];
  return loadComponent
    ? { path, loadComponent }
    : { path, component: SectionPage, data: { sectionId: section.id, childId: child.id } };
}

// Each section gets its own route, a route per child, and — when a child has
// third-level items — a route per grand-child plus a redirect from the child to
// its first grand-child.
const sectionRoutes: Routes = NAV_SECTIONS.flatMap((section) => [
  // The section landing page is the mock SectionPage unless a real overview
  // page is registered in PAGE_OVERRIDES under the bare section id.
  PAGE_OVERRIDES[section.id]
    ? { path: section.id, loadComponent: PAGE_OVERRIDES[section.id] }
    : {
        path: section.id,
        component: SectionPage,
        data: { sectionId: section.id },
      },
  ...section.children.flatMap((child): Routes => {
    const base = `${section.id}/${child.id}`;
    const subs = child.children;
    if (subs?.length) {
      return [
        { path: base, pathMatch: 'full', redirectTo: `${base}/${subs[0].id}` },
        ...subs.map((sub) => leafRoute(`${base}/${sub.id}`, section, sub)),
      ];
    }
    return [leafRoute(base, section, child)];
  }),
]);

export const routes: Routes = [
  { path: '', component: SectionPage, pathMatch: 'full' },
  ...sectionRoutes,
  { path: '**', redirectTo: '' },
];
