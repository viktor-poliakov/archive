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
  'javascript/operators/arithmetic': () =>
    import('./operators/arithmetic/arithmetic').then((m) => m.OperatorsArithmetic),
  'javascript/operators/comparison': () =>
    import('./operators/comparison/comparison').then((m) => m.OperatorsComparison),
  'javascript/operators/logical': () =>
    import('./operators/logical/logical').then((m) => m.OperatorsLogical),
  'javascript/operators/coercion': () =>
    import('./operators/coercion/coercion').then((m) => m.OperatorsCoercion),
  'javascript/operators/pitfalls': () =>
    import('./operators/pitfalls/pitfalls').then((m) => m.OperatorsPitfalls),
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
  'javascript/numbers/basics': () =>
    import('./numbers/basics/basics').then((m) => m.NumbersBasics),
  'javascript/numbers/methods': () =>
    import('./numbers/methods/methods').then((m) => m.NumbersMethods),
  'javascript/numbers/math': () =>
    import('./numbers/math/math').then((m) => m.NumbersMath),
  'javascript/numbers/precision': () =>
    import('./numbers/precision/precision').then((m) => m.NumbersPrecision),
  'javascript/numbers/pitfalls': () =>
    import('./numbers/pitfalls/pitfalls').then((m) => m.NumbersPitfalls),
  'javascript/strings/basics': () =>
    import('./strings/basics/basics').then((m) => m.StringsBasics),
  'javascript/strings/templates': () =>
    import('./strings/templates/templates').then((m) => m.StringsTemplates),
  'javascript/strings/methods': () =>
    import('./strings/methods/methods').then((m) => m.StringsMethods),
  'javascript/strings/unicode': () =>
    import('./strings/unicode/unicode').then((m) => m.StringsUnicode),
  'javascript/strings/pitfalls': () =>
    import('./strings/pitfalls/pitfalls').then((m) => m.StringsPitfalls),
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
  'javascript/prototypes/constructors': () =>
    import('./prototypes/constructors/constructors').then((m) => m.PrototypesConstructors),
  'javascript/prototypes/chain': () =>
    import('./prototypes/chain/chain').then((m) => m.PrototypesChain),
  'javascript/modules/basics': () =>
    import('./modules/basics/basics').then((m) => m.ModulesBasics),
  'javascript/modules/export': () =>
    import('./modules/export/export').then((m) => m.ModulesExport),
  'javascript/modules/import': () =>
    import('./modules/import/import').then((m) => m.ModulesImport),
  'javascript/modules/dynamic': () =>
    import('./modules/dynamic/dynamic').then((m) => m.ModulesDynamic),
  'javascript/modules/pitfalls': () =>
    import('./modules/pitfalls/pitfalls').then((m) => m.ModulesPitfalls),
  'javascript/errors/try-catch': () =>
    import('./errors/try-catch/try-catch').then((m) => m.ErrorsTryCatch),
  'javascript/errors/throw': () =>
    import('./errors/throw/throw').then((m) => m.ErrorsThrow),
  'javascript/errors/error-object': () =>
    import('./errors/error-object/error-object').then((m) => m.ErrorsErrorObject),
  'javascript/errors/custom': () =>
    import('./errors/custom/custom').then((m) => m.ErrorsCustom),
  'javascript/errors/propagation': () =>
    import('./errors/propagation/propagation').then((m) => m.ErrorsPropagation),
  'javascript/errors/pitfalls': () =>
    import('./errors/pitfalls/pitfalls').then((m) => m.ErrorsPitfalls),
  'javascript/promises/basics': () =>
    import('./promises/basics/basics').then((m) => m.PromisesBasics),
  'javascript/promises/then-catch-finally': () =>
    import('./promises/then-catch-finally/then-catch-finally').then((m) => m.PromisesThenCatchFinally),
  'javascript/promises/chaining': () =>
    import('./promises/chaining/chaining').then((m) => m.PromisesChaining),
  'javascript/promises/error-handling': () =>
    import('./promises/error-handling/error-handling').then((m) => m.PromisesErrorHandling),
  'javascript/promises/static-methods': () =>
    import('./promises/static-methods/static-methods').then((m) => m.PromisesStaticMethods),
  'javascript/promises/async-await': () =>
    import('./promises/async-await/async-await').then((m) => m.PromisesAsyncAwait),
  'javascript/promises/creating': () =>
    import('./promises/creating/creating').then((m) => m.PromisesCreating),
  'javascript/promises/pitfalls': () =>
    import('./promises/pitfalls/pitfalls').then((m) => m.PromisesPitfalls),
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
  'javascript/rest-api/basics': () =>
    import('./rest-api/basics/basics').then((m) => m.RestApiBasics),
  'javascript/rest-api/http': () =>
    import('./rest-api/http/http').then((m) => m.RestApiHttp),
  'javascript/rest-api/methods': () =>
    import('./rest-api/methods/methods').then((m) => m.RestApiMethods),
  'javascript/rest-api/status-codes': () =>
    import('./rest-api/status-codes/status-codes').then((m) => m.RestApiStatusCodes),
  'javascript/rest-api/headers': () =>
    import('./rest-api/headers/headers').then((m) => m.RestApiHeaders),
  'javascript/rest-api/fetch': () =>
    import('./rest-api/fetch/fetch').then((m) => m.RestApiFetch),
  'javascript/rest-api/query-params': () =>
    import('./rest-api/query-params/query-params').then((m) => m.RestApiQueryParams),
  'javascript/rest-api/files': () =>
    import('./rest-api/files/files').then((m) => m.RestApiFiles),
  'javascript/rest-api/cancellation': () =>
    import('./rest-api/cancellation/cancellation').then((m) => m.RestApiCancellation),
  'javascript/rest-api/auth': () =>
    import('./rest-api/auth/auth').then((m) => m.RestApiAuth),
  'javascript/rest-api/errors': () =>
    import('./rest-api/errors/errors').then((m) => m.RestApiErrors),
  'javascript/rest-api/pitfalls': () =>
    import('./rest-api/pitfalls/pitfalls').then((m) => m.RestApiPitfalls),
  'javascript/dates/basics': () =>
    import('./dates/basics/basics').then((m) => m.DatesBasics),
  'javascript/dates/format': () =>
    import('./dates/format/format').then((m) => m.DatesFormat),
  'javascript/dates/pitfalls': () =>
    import('./dates/pitfalls/pitfalls').then((m) => m.DatesPitfalls),
  'javascript/dates/temporal': () =>
    import('./dates/temporal/temporal').then((m) => m.DatesTemporal),
  'javascript/garbage-collection/how-it-works': () =>
    import('./garbage-collection/how-it-works/how-it-works').then((m) => m.GarbageCollectionHowItWorks),
  'javascript/garbage-collection/leaks': () =>
    import('./garbage-collection/leaks/leaks').then((m) => m.GarbageCollectionLeaks),
  'javascript/collections/map-set': () =>
    import('./collections/map-set/map-set').then((m) => m.CollectionsMapSet),
  'javascript/collections/weak': () =>
    import('./collections/weak/weak').then((m) => m.CollectionsWeak),
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
