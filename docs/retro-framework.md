# retro Framework Documentation

retro is a minimal client-side SPA framework built on web standards: HTML `<template>` elements, the native DOM API, and ES modules. It provides two core abstractions — `Component` and `Router` — and nothing else.

## Design Philosophy

- **No virtual DOM.** Components clone HTML `<template>` elements and manipulate the real DOM directly.
- **No bundler.** TypeScript compiles to ES modules that the browser loads natively.
- **No magic.** State management is explicit. Re-rendering is a full replace of the component's DOM subtree.
- **Templates in HTML.** UI structure lives in `<template>` tags in your HTML file, not in JavaScript strings or JSX.

## API Reference

### `Component`

Abstract base class for all UI components.

```typescript
import { Component } from './retro/index.js';
```

#### Constructor

```typescript
constructor(container: HTMLElement, templateId: string)
```

- `container` — the DOM element this component renders into
- `templateId` — the `id` attribute of a `<template>` element in the HTML

The constructor stores these references but does **not** render automatically. Subclasses must call `this.render()` after setting up their own fields.

#### Abstract Method: `mount()`

```typescript
abstract mount(): void;
```

Called by `render()` after the template has been cloned and appended to the container. This is where subclasses should:

- Query DOM nodes using `this.query()` / `this.queryAll()`
- Set text content, attributes, and values
- Attach event listeners
- Create child components

#### `render()`

```typescript
protected render(): void
```

Clears the container's innerHTML, clones the template, appends it, and calls `mount()`. This performs a full re-render of the component.

#### `setState(updater)`

```typescript
protected setState(updater: () => void): void
```

Calls the `updater` function, then calls `render()`. Use this to update component state and trigger a re-render in one step.

```typescript
// Example
this.setState(() => {
  this.count += 1;
});
```

#### `query(selector)` / `queryAll(selector)`

```typescript
protected query<T extends HTMLElement>(selector: string): T
protected queryAll<T extends HTMLElement>(selector: string): T[]
```

Query elements within this component's root container. `query()` throws if no element matches. `queryAll()` returns an array (possibly empty).

#### `destroy()`

```typescript
destroy(): void
```

Clears the component's container. Call this when removing a component from the page.

### Example Component

HTML template:

```html
<template id="counter-template">
  <div class="counter">
    <span class="count">0</span>
    <button class="increment">+1</button>
  </div>
</template>
```

TypeScript:

```typescript
import { Component } from './retro/index.js';

class Counter extends Component {
  private count = 0;

  constructor(container: HTMLElement) {
    super(container, 'counter-template');
    this.render();
  }

  mount(): void {
    this.query('.count').textContent = String(this.count);
    this.query('.increment').addEventListener('click', () => {
      this.setState(() => {
        this.count += 1;
      });
    });
  }
}
```

---

### `Router`

Hash-based SPA router.

```typescript
import { Router } from './retro/index.js';
```

#### `addRoute(pattern, handler)`

```typescript
addRoute(pattern: string, handler: (params: Record<string, string>) => void): void
```

Registers a route. Patterns use `#/` prefix and support named parameters with `:`.

```typescript
router.addRoute('#/', (params) => { /* home */ });
router.addRoute('#/board/:id', (params) => {
  console.log(params.id);
});
```

#### `navigate(hash)`

```typescript
navigate(hash: string): void
```

Programmatically navigate to a hash route.

```typescript
router.navigate('#/board/42');
```

#### `start()`

```typescript
start(): void
```

Begins listening for `hashchange` events and resolves the current hash. Call this once after all routes are registered.

### Route Matching

Routes are matched by splitting on `/` and comparing segments. A route segment starting with `:` matches any path segment and captures it as a named parameter.

| Pattern | URL | Match | Params |
|---|---|---|---|
| `#/` | `#/` | Yes | `{}` |
| `#/board/:id` | `#/board/42` | Yes | `{ id: "42" }` |
| `#/board/:id` | `#/board` | No | — |

---

## Component Lifecycle

1. **Constructor** — subclass calls `super(container, templateId)`, sets up its own fields, then calls `this.render()`
2. **render()** — clears container, clones template into container, calls `mount()`
3. **mount()** — subclass binds data and events to the freshly cloned DOM
4. **setState()** — updates state, then repeats steps 2–3
5. **destroy()** — clears the container

Re-rendering is a full replacement: the entire component subtree is discarded and rebuilt from the template. This keeps the model simple and predictable at the cost of losing transient DOM state (scroll position, focus, input values) on each render. For most components this is acceptable; for forms and modals, render only when the dialog opens, not on every keystroke.

## Project Setup

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src"]
}
```

### Import Paths

Since the browser loads the compiled `.js` files directly (no bundler), all import paths must use the `.js` extension:

```typescript
import { Component } from '../retro/index.js';
import { Store } from './store.js';
```

### HTML Setup

Templates and the module entry point are declared in your HTML file:

```html
<template id="my-template">
  <div class="my-component">...</div>
</template>

<script type="module" src="../dist/app/main.js"></script>
```
