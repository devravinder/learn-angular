# Angular - V21

## Terminlogy

- IOC
- componenet, @Component
- Service, @Injectable
- selector, template, style, imports
- type of selectors
- componets composition
- directives, pipes, data binding, event binding, two-way binding
- @if, @for, detect (key)
- routing, forms
  - ActivatedRoute
  - forms
    - Reference
      - [Ref](https://angular.dev/essentials/signal-forms)
      - [Ref](https://angular.dev/guide/forms)
    - Reactive forms
    - Template-driven forms
    - form(), [formField], vlaue()
- Observables, RxJs
- Reactive state with NgRx
- Signals
  - computed
  - WritableSignal
  - ReadOnly
  - linkedSignal
  - assertNotInReactiveContext
- effect, afterRenderEffct
  - untracked
- Resource
- Change Detection:
  - onPush
  - @HostListener
  - ChnageDetecrorRef
- zone pollution, - [Ref](https://angular.dev/best-practices/zone-pollution)
- NgZone, runOutsideAngular
- inject
- Component Lifecycle - [Ref](https://angular.dev/guide/components/lifecycle) ***
- context ?
- Custom events with outputs
- `<ng-content>` ( single & multiple)
- `ng-template`, `<ng-container>`
- Variables in templates
  - @let
- Deferred loading
  - @defer
- Host elements, host ( Binding to the host element )
  - The @HostBinding and @HostListener
  - Binding collisions
  - Injecting host element attributes
- Referencing component children with queries
  - viewChild

## Observations

- event listeners - (click)="handleClick($event)"
- input() - what component takes as args - like props
  - is a signal
- output() - what component gives back
  - we can create/trigger custom events

- while passing args/props
  - [] means expression ( dynamic data)
  - normal means string value

- conditional css classes

- services
  - for state & reusable functions
  - @injectable , inject

- routing
  - router-outlet
    - named outlet
  - RouterLink (routerLink) directive
    - directive = component without template
  - lazy loading

- for state
  - signals
  - computed signals

- api calls
  - prefer with signals: fetch/axios
  - http client
    - provideHttpClient() & inject(HttpClient)

- directives
  - component
  - attribute
  - structural : conditionally to add/remove data/element form DOM
    - @if (old: *ngIf)
    - @for

- Pipes: to transform the data
  - bult in
  - custom pipes
    - eg: filter todos

- ElementRef : to get the reference to the element
  - ref = inject(ElementRef)

  - eg: Hihlight Directive = used along with effect to style

- FormsModule : to work with Forms/input
  - [(ngModel)]="searchTerm"

- slots (`<ng-content />`)
  - named slots

## CLI

- to create project

  ```bash
     ng new todo-app
  ```

  or

  ```bash
     ng new todo-app --inline-style --inline-template --package-manager=pnpm
  ```

   for help `ng new --help`

- `ng g c components/button` or `ng generate component componenets/button`
- `ng g d directives/highlight` or `ng generate directive directives/highlight`
- `ng g p pipes/filter-todos` or `ng generate pipe pipes/filter-todos`
