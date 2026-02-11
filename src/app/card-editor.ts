import { Component } from '../retro/index.js';
import { Store } from './store.js';

export class CardEditor extends Component {
  private onClose: () => void;
  private store: Store;
  private editingCardId: string | null;
  private columnId: string;

  constructor(
    container: HTMLElement,
    store: Store,
    columnId: string,
    editingCardId: string | null,
    onClose: () => void
  ) {
    super(container, 'card-editor-template');
    this.store = store;
    this.columnId = columnId;
    this.editingCardId = editingCardId;
    this.onClose = onClose;
    this.render();
  }

  mount(): void {
    const form = this.query<HTMLFormElement>('.card-editor-form');
    const titleInput = this.query<HTMLInputElement>('.card-title-input');
    const descInput = this.query<HTMLTextAreaElement>('.card-desc-input');
    const heading = this.query<HTMLElement>('.card-editor-heading');
    const cancelBtn = this.query<HTMLButtonElement>('.card-editor-cancel');

    if (this.editingCardId) {
      const card = this.store.getCard(this.editingCardId);
      if (card) {
        titleInput.value = card.title;
        descInput.value = card.description;
        heading.textContent = 'Edit Card';
      }
    } else {
      heading.textContent = 'New Card';
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      if (!title) return;
      const description = descInput.value.trim();

      if (this.editingCardId) {
        this.store.updateCard(this.editingCardId, { title, description });
      } else {
        this.store.addCard(this.columnId, title, description);
      }
      this.onClose();
    });

    cancelBtn.addEventListener('click', () => {
      this.onClose();
    });

    const overlay = this.query<HTMLElement>('.card-editor-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.onClose();
      }
    });
  }
}
