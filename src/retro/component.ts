export abstract class Component {
  protected root: HTMLElement;
  private templateId: string;

  constructor(container: HTMLElement, templateId: string) {
    this.root = container;
    this.templateId = templateId;
  }

  abstract mount(): void;

  protected setState(updater: () => void): void {
    updater();
    this.render();
  }

  protected render(): void {
    this.root.innerHTML = '';
    const template = document.getElementById(this.templateId) as HTMLTemplateElement | null;
    if (!template) {
      throw new Error(`Template #${this.templateId} not found`);
    }
    const clone = template.content.cloneNode(true) as DocumentFragment;
    this.root.appendChild(clone);
    this.mount();
  }

  protected query<T extends HTMLElement>(selector: string): T {
    const el = this.root.querySelector<T>(selector);
    if (!el) {
      throw new Error(`Element not found: ${selector}`);
    }
    return el;
  }

  protected queryAll<T extends HTMLElement>(selector: string): T[] {
    return Array.from(this.root.querySelectorAll<T>(selector));
  }

  destroy(): void {
    this.root.innerHTML = '';
  }
}
