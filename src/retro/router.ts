type RouteHandler = (params: Record<string, string>) => void;

interface Route {
  pattern: string;
  parts: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  addRoute(pattern: string, handler: RouteHandler): void {
    const parts = pattern.replace(/^#/, '').split('/');
    this.routes.push({ pattern, parts, handler });
  }

  navigate(hash: string): void {
    window.location.hash = hash;
  }

  start(): void {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  }

  private resolve(): void {
    const hash = window.location.hash || '#/';
    const path = hash.replace(/^#/, '');
    const segments = path.split('/');

    for (const route of this.routes) {
      const params = this.match(route.parts, segments);
      if (params !== null) {
        route.handler(params);
        return;
      }
    }
  }

  private match(
    routeParts: string[],
    pathParts: string[]
  ): Record<string, string> | null {
    if (routeParts.length !== pathParts.length) return null;

    const params: Record<string, string> = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }
}
