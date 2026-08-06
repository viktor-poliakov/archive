import { Route, Routes } from '@angular/router';

import { NavChild, NAV_SECTIONS, NavSection } from './nav/nav.data';
import { SectionPage } from './section-page/section-page';

// Submenu items that have a real, dedicated page instead of the mock SectionPage.
// Keyed by full path ("<section>/<child>" or "<section>/<child>/<sub>"); lazily
// loaded so content pages stay out of the initial bundle. Add an entry here as
// each topic gets real content.
const PAGE_OVERRIDES: Record<string, Route['loadComponent']> = {
  javascript: () => import('./javascript/javascript').then((m) => m.JavascriptOverview),
  typescript: () => import('./typescript/typescript').then((m) => m.TypescriptOverview),
  'typescript/basic-types/primitives': () =>
    import('./typescript/basic-types/primitives/primitives').then((m) => m.BasicTypesPrimitives),
  'typescript/basic-types/arrays-tuples': () =>
    import('./typescript/basic-types/arrays-tuples/arrays-tuples').then((m) => m.BasicTypesArraysTuples),
  'typescript/basic-types/any-unknown': () =>
    import('./typescript/basic-types/any-unknown/any-unknown').then((m) => m.BasicTypesAnyUnknown),
  'typescript/basic-types/void-never': () =>
    import('./typescript/basic-types/void-never/void-never').then((m) => m.BasicTypesVoidNever),
  'typescript/basic-types/literal-types': () =>
    import('./typescript/basic-types/literal-types/literal-types').then((m) => m.BasicTypesLiteralTypes),
  'typescript/basic-types/subtypes-supertypes': () =>
    import('./typescript/basic-types/subtypes-supertypes/subtypes-supertypes').then(
      (m) => m.BasicTypesSubtypesSupertypes,
    ),
  'typescript/basic-types/inference': () =>
    import('./typescript/basic-types/inference/inference').then((m) => m.BasicTypesInference),
  'typescript/basic-types/pitfalls': () =>
    import('./typescript/basic-types/pitfalls/pitfalls').then((m) => m.BasicTypesPitfalls),
  'typescript/objects-interfaces/object-types': () =>
    import('./typescript/objects-interfaces/object-types/object-types').then(
      (m) => m.ObjectsInterfacesObjectTypes,
    ),
  'typescript/objects-interfaces/interfaces': () =>
    import('./typescript/objects-interfaces/interfaces/interfaces').then(
      (m) => m.ObjectsInterfacesInterfaces,
    ),
  'typescript/objects-interfaces/type-aliases': () =>
    import('./typescript/objects-interfaces/type-aliases/type-aliases').then(
      (m) => m.ObjectsInterfacesTypeAliases,
    ),
  'typescript/objects-interfaces/interface-vs-type': () =>
    import('./typescript/objects-interfaces/interface-vs-type/interface-vs-type').then(
      (m) => m.ObjectsInterfacesInterfaceVsType,
    ),
  'typescript/objects-interfaces/optional-readonly': () =>
    import('./typescript/objects-interfaces/optional-readonly/optional-readonly').then(
      (m) => m.ObjectsInterfacesOptionalReadonly,
    ),
  'typescript/objects-interfaces/index-signatures': () =>
    import('./typescript/objects-interfaces/index-signatures/index-signatures').then(
      (m) => m.ObjectsInterfacesIndexSignatures,
    ),
  'typescript/objects-interfaces/extending': () =>
    import('./typescript/objects-interfaces/extending/extending').then(
      (m) => m.ObjectsInterfacesExtending,
    ),
  'typescript/objects-interfaces/pitfalls': () =>
    import('./typescript/objects-interfaces/pitfalls/pitfalls').then(
      (m) => m.ObjectsInterfacesPitfalls,
    ),
  'typescript/functions/basics': () =>
    import('./typescript/functions/basics/basics').then((m) => m.TypescriptFunctionsBasics),
  'typescript/functions/parameters': () =>
    import('./typescript/functions/parameters/parameters').then(
      (m) => m.TypescriptFunctionsParameters,
    ),
  'typescript/functions/rest': () =>
    import('./typescript/functions/rest/rest').then((m) => m.TypescriptFunctionsRest),
  'typescript/functions/return-types': () =>
    import('./typescript/functions/return-types/return-types').then(
      (m) => m.TypescriptFunctionsReturnTypes,
    ),
  'typescript/functions/overloads': () =>
    import('./typescript/functions/overloads/overloads').then(
      (m) => m.TypescriptFunctionsOverloads,
    ),
  'typescript/functions/this': () =>
    import('./typescript/functions/this/this').then((m) => m.TypescriptFunctionsThis),
  'typescript/functions/pitfalls': () =>
    import('./typescript/functions/pitfalls/pitfalls').then(
      (m) => m.TypescriptFunctionsPitfalls,
    ),
  'typescript/unions-narrowing/union': () =>
    import('./typescript/unions-narrowing/union/union').then(
      (m) => m.TypescriptUnionsNarrowingUnion,
    ),
  'typescript/unions-narrowing/intersection': () =>
    import('./typescript/unions-narrowing/intersection/intersection').then(
      (m) => m.TypescriptUnionsNarrowingIntersection,
    ),
  'typescript/unions-narrowing/narrowing': () =>
    import('./typescript/unions-narrowing/narrowing/narrowing').then(
      (m) => m.TypescriptUnionsNarrowingNarrowing,
    ),
  'typescript/unions-narrowing/type-guards': () =>
    import('./typescript/unions-narrowing/type-guards/type-guards').then(
      (m) => m.TypescriptUnionsNarrowingTypeGuards,
    ),
  'typescript/unions-narrowing/discriminated-unions': () =>
    import('./typescript/unions-narrowing/discriminated-unions/discriminated-unions').then(
      (m) => m.TypescriptUnionsNarrowingDiscriminatedUnions,
    ),
  'typescript/unions-narrowing/pitfalls': () =>
    import('./typescript/unions-narrowing/pitfalls/pitfalls').then(
      (m) => m.TypescriptUnionsNarrowingPitfalls,
    ),
  'typescript/enums/numeric': () =>
    import('./typescript/enums/numeric/numeric').then((m) => m.TypescriptEnumsNumeric),
  'typescript/enums/string': () =>
    import('./typescript/enums/string/string').then((m) => m.TypescriptEnumsString),
  'typescript/enums/const-enum': () =>
    import('./typescript/enums/const-enum/const-enum').then((m) => m.TypescriptEnumsConstEnum),
  'typescript/enums/alternatives': () =>
    import('./typescript/enums/alternatives/alternatives').then(
      (m) => m.TypescriptEnumsAlternatives,
    ),
  'typescript/enums/pitfalls': () =>
    import('./typescript/enums/pitfalls/pitfalls').then((m) => m.TypescriptEnumsPitfalls),
  'typescript/generics/basics': () =>
    import('./typescript/generics/basics/basics').then((m) => m.TypescriptGenericsBasics),
  'typescript/generics/functions': () =>
    import('./typescript/generics/functions/functions').then((m) => m.TypescriptGenericsFunctions),
  'typescript/generics/constraints': () =>
    import('./typescript/generics/constraints/constraints').then(
      (m) => m.TypescriptGenericsConstraints,
    ),
  'typescript/generics/defaults': () =>
    import('./typescript/generics/defaults/defaults').then((m) => m.TypescriptGenericsDefaults),
  'typescript/generics/classes-interfaces': () =>
    import('./typescript/generics/classes-interfaces/classes-interfaces').then(
      (m) => m.TypescriptGenericsClassesInterfaces,
    ),
  'typescript/generics/pitfalls': () =>
    import('./typescript/generics/pitfalls/pitfalls').then((m) => m.TypescriptGenericsPitfalls),
  'typescript/classes/basics': () =>
    import('./typescript/classes/basics/basics').then((m) => m.TypescriptClassesBasics),
  'typescript/classes/access-modifiers': () =>
    import('./typescript/classes/access-modifiers/access-modifiers').then(
      (m) => m.TypescriptClassesAccessModifiers,
    ),
  'typescript/classes/readonly-static': () =>
    import('./typescript/classes/readonly-static/readonly-static').then(
      (m) => m.TypescriptClassesReadonlyStatic,
    ),
  'typescript/classes/parameter-properties': () =>
    import('./typescript/classes/parameter-properties/parameter-properties').then(
      (m) => m.TypescriptClassesParameterProperties,
    ),
  'typescript/classes/abstract': () =>
    import('./typescript/classes/abstract/abstract').then((m) => m.TypescriptClassesAbstract),
  'typescript/classes/implements': () =>
    import('./typescript/classes/implements/implements').then(
      (m) => m.TypescriptClassesImplements,
    ),
  'typescript/classes/pitfalls': () =>
    import('./typescript/classes/pitfalls/pitfalls').then((m) => m.TypescriptClassesPitfalls),
  'typescript/advanced-types/keyof': () =>
    import('./typescript/advanced-types/keyof/keyof').then((m) => m.TypescriptAdvancedTypesKeyof),
  'typescript/advanced-types/typeof': () =>
    import('./typescript/advanced-types/typeof/typeof').then((m) => m.TypescriptAdvancedTypesTypeof),
  'typescript/advanced-types/indexed-access': () =>
    import('./typescript/advanced-types/indexed-access/indexed-access').then(
      (m) => m.TypescriptAdvancedTypesIndexedAccess,
    ),
  'typescript/advanced-types/conditional': () =>
    import('./typescript/advanced-types/conditional/conditional').then(
      (m) => m.TypescriptAdvancedTypesConditional,
    ),
  'typescript/advanced-types/infer': () =>
    import('./typescript/advanced-types/infer/infer').then((m) => m.TypescriptAdvancedTypesInfer),
  'typescript/advanced-types/mapped': () =>
    import('./typescript/advanced-types/mapped/mapped').then((m) => m.TypescriptAdvancedTypesMapped),
  'typescript/advanced-types/template-literals': () =>
    import('./typescript/advanced-types/template-literals/template-literals').then(
      (m) => m.TypescriptAdvancedTypesTemplateLiterals,
    ),
  'typescript/advanced-types/pitfalls': () =>
    import('./typescript/advanced-types/pitfalls/pitfalls').then(
      (m) => m.TypescriptAdvancedTypesPitfalls,
    ),
  'typescript/utility-types/partial-required-readonly': () =>
    import('./typescript/utility-types/partial-required-readonly/partial-required-readonly').then(
      (m) => m.TypescriptUtilityTypesPartialRequiredReadonly,
    ),
  'typescript/utility-types/pick-omit': () =>
    import('./typescript/utility-types/pick-omit/pick-omit').then(
      (m) => m.TypescriptUtilityTypesPickOmit,
    ),
  'typescript/utility-types/record': () =>
    import('./typescript/utility-types/record/record').then((m) => m.TypescriptUtilityTypesRecord),
  'typescript/utility-types/exclude-extract': () =>
    import('./typescript/utility-types/exclude-extract/exclude-extract').then(
      (m) => m.TypescriptUtilityTypesExcludeExtract,
    ),
  'typescript/utility-types/function-types': () =>
    import('./typescript/utility-types/function-types/function-types').then(
      (m) => m.TypescriptUtilityTypesFunctionTypes,
    ),
  'typescript/utility-types/awaited': () =>
    import('./typescript/utility-types/awaited/awaited').then(
      (m) => m.TypescriptUtilityTypesAwaited,
    ),
  'typescript/assertions/as': () =>
    import('./typescript/assertions/as/as').then((m) => m.TypescriptAssertionsAs),
  'typescript/assertions/as-const': () =>
    import('./typescript/assertions/as-const/as-const').then(
      (m) => m.TypescriptAssertionsAsConst,
    ),
  'typescript/assertions/non-null': () =>
    import('./typescript/assertions/non-null/non-null').then(
      (m) => m.TypescriptAssertionsNonNull,
    ),
  'typescript/assertions/user-type-guards': () =>
    import('./typescript/assertions/user-type-guards/user-type-guards').then(
      (m) => m.TypescriptAssertionsUserTypeGuards,
    ),
  'typescript/assertions/assertion-functions': () =>
    import('./typescript/assertions/assertion-functions/assertion-functions').then(
      (m) => m.TypescriptAssertionsAssertionFunctions,
    ),
  'typescript/assertions/pitfalls': () =>
    import('./typescript/assertions/pitfalls/pitfalls').then(
      (m) => m.TypescriptAssertionsPitfalls,
    ),
  'typescript/modules-types/import-export': () =>
    import('./typescript/modules-types/import-export/import-export').then(
      (m) => m.TypescriptModulesTypesImportExport,
    ),
  'typescript/modules-types/declare': () =>
    import('./typescript/modules-types/declare/declare').then(
      (m) => m.TypescriptModulesTypesDeclare,
    ),
  'typescript/modules-types/declaration-files': () =>
    import('./typescript/modules-types/declaration-files/declaration-files').then(
      (m) => m.TypescriptModulesTypesDeclarationFiles,
    ),
  'typescript/modules-types/third-party': () =>
    import('./typescript/modules-types/third-party/third-party').then(
      (m) => m.TypescriptModulesTypesThirdParty,
    ),
  'typescript/modules-types/declaration-merging': () =>
    import('./typescript/modules-types/declaration-merging/declaration-merging').then(
      (m) => m.TypescriptModulesTypesDeclarationMerging,
    ),
  'typescript/modules-types/namespaces': () =>
    import('./typescript/modules-types/namespaces/namespaces').then(
      (m) => m.TypescriptModulesTypesNamespaces,
    ),
  'typescript/modules-types/pitfalls': () =>
    import('./typescript/modules-types/pitfalls/pitfalls').then(
      (m) => m.TypescriptModulesTypesPitfalls,
    ),
  'typescript/decorators/basics': () =>
    import('./typescript/decorators/basics/basics').then((m) => m.TypescriptDecoratorsBasics),
  'typescript/decorators/class': () =>
    import('./typescript/decorators/class/class').then((m) => m.TypescriptDecoratorsClass),
  'typescript/decorators/members': () =>
    import('./typescript/decorators/members/members').then(
      (m) => m.TypescriptDecoratorsMembers,
    ),
  'typescript/decorators/metadata': () =>
    import('./typescript/decorators/metadata/metadata').then(
      (m) => m.TypescriptDecoratorsMetadata,
    ),
  'typescript/decorators/pitfalls': () =>
    import('./typescript/decorators/pitfalls/pitfalls').then(
      (m) => m.TypescriptDecoratorsPitfalls,
    ),
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
  'javascript/regex/basics': () =>
    import('./regex/basics/basics').then((m) => m.RegexBasics),
  'javascript/regex/char-classes': () =>
    import('./regex/char-classes/char-classes').then((m) => m.RegexCharClasses),
  'javascript/regex/quantifiers': () =>
    import('./regex/quantifiers/quantifiers').then((m) => m.RegexQuantifiers),
  'javascript/regex/groups': () =>
    import('./regex/groups/groups').then((m) => m.RegexGroups),
  'javascript/regex/methods': () =>
    import('./regex/methods/methods').then((m) => m.RegexMethods),
  'javascript/regex/practical': () =>
    import('./regex/practical/practical').then((m) => m.RegexPractical),
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
  'javascript/json/basics': () =>
    import('./json/basics/basics').then((m) => m.JsonBasics),
  'javascript/json/stringify': () =>
    import('./json/stringify/stringify').then((m) => m.JsonStringify),
  'javascript/json/parse': () =>
    import('./json/parse/parse').then((m) => m.JsonParse),
  'javascript/json/practical': () =>
    import('./json/practical/practical').then((m) => m.JsonPractical),
  'javascript/json/pitfalls': () =>
    import('./json/pitfalls/pitfalls').then((m) => m.JsonPitfalls),
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
  'javascript/iterators/protocol': () =>
    import('./iterators/protocol/protocol').then((m) => m.IteratorsProtocol),
  'javascript/iterators/for-of': () =>
    import('./iterators/for-of/for-of').then((m) => m.IteratorsForOf),
  'javascript/iterators/custom': () =>
    import('./iterators/custom/custom').then((m) => m.IteratorsCustom),
  'javascript/iterators/generators': () =>
    import('./iterators/generators/generators').then((m) => m.IteratorsGenerators),
  'javascript/iterators/techniques': () =>
    import('./iterators/techniques/techniques').then((m) => m.IteratorsTechniques),
  'javascript/iterators/practical': () =>
    import('./iterators/practical/practical').then((m) => m.IteratorsPractical),
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
  'javascript/web-workers/basics': () =>
    import('./web-workers/basics/basics').then((m) => m.WebWorkersBasics),
  'javascript/web-workers/messaging': () =>
    import('./web-workers/messaging/messaging').then((m) => m.WebWorkersMessaging),
  'javascript/web-workers/practical': () =>
    import('./web-workers/practical/practical').then((m) => m.WebWorkersPractical),
  'javascript/web-workers/types': () =>
    import('./web-workers/types/types').then((m) => m.WebWorkersTypes),
  'javascript/web-workers/pitfalls': () =>
    import('./web-workers/pitfalls/pitfalls').then((m) => m.WebWorkersPitfalls),
  'javascript/dom/basics': () =>
    import('./dom/basics/basics').then((m) => m.DomBasics),
  'javascript/dom/search': () =>
    import('./dom/search/search').then((m) => m.DomSearch),
  'javascript/dom/content': () =>
    import('./dom/content/content').then((m) => m.DomContent),
  'javascript/dom/attributes': () =>
    import('./dom/attributes/attributes').then((m) => m.DomAttributes),
  'javascript/dom/create': () =>
    import('./dom/create/create').then((m) => m.DomCreate),
  'javascript/dom/template': () =>
    import('./dom/template/template').then((m) => m.DomTemplate),
  'javascript/dom/pitfalls': () =>
    import('./dom/pitfalls/pitfalls').then((m) => m.DomPitfalls),
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
  'javascript/storage/basics': () =>
    import('./storage/basics/basics').then((m) => m.StorageBasics),
  'javascript/storage/local-session': () =>
    import('./storage/local-session/local-session').then((m) => m.StorageLocalSession),
  'javascript/storage/cookies': () =>
    import('./storage/cookies/cookies').then((m) => m.StorageCookies),
  'javascript/storage/indexeddb': () =>
    import('./storage/indexeddb/indexeddb').then((m) => m.StorageIndexeddb),
  'javascript/storage/pitfalls': () =>
    import('./storage/pitfalls/pitfalls').then((m) => m.StoragePitfalls),
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
  'javascript/symbol/basics': () =>
    import('./symbol/basics/basics').then((m) => m.SymbolBasics),
  'javascript/symbol/as-keys': () =>
    import('./symbol/as-keys/as-keys').then((m) => m.SymbolAsKeys),
  'javascript/symbol/global-registry': () =>
    import('./symbol/global-registry/global-registry').then((m) => m.SymbolGlobalRegistry),
  'javascript/symbol/well-known': () =>
    import('./symbol/well-known/well-known').then((m) => m.SymbolWellKnown),
  'javascript/symbol/pitfalls': () =>
    import('./symbol/pitfalls/pitfalls').then((m) => m.SymbolPitfalls),
  'javascript/proxy-reflect/basics': () =>
    import('./proxy-reflect/basics/basics').then((m) => m.ProxyReflectBasics),
  'javascript/proxy-reflect/traps': () =>
    import('./proxy-reflect/traps/traps').then((m) => m.ProxyReflectTraps),
  'javascript/proxy-reflect/reflect': () =>
    import('./proxy-reflect/reflect/reflect').then((m) => m.ProxyReflectReflect),
  'javascript/proxy-reflect/practical': () =>
    import('./proxy-reflect/practical/practical').then((m) => m.ProxyReflectPractical),
  'javascript/proxy-reflect/pitfalls': () =>
    import('./proxy-reflect/pitfalls/pitfalls').then((m) => m.ProxyReflectPitfalls),
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
