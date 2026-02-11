import { Component } from '../retro/index.js';
import { Store } from './store.js';
import { CardEditor } from './card-editor.js';

export class BoardComponent extends Component {
  private store: Store;
  private editorContainer: HTMLElement | null = null;

  constructor(container: HTMLElement, store: Store) {
    super(container, 'board-template');
    this.store = store;
    this.render();
  }

  mount(): void {
    const columnsContainer = this.query<HTMLElement>('.board-columns');

    for (const column of this.store.getColumns()) {
      const colTemplate = document.getElementById('column-template') as HTMLTemplateElement;
      const colClone = colTemplate.content.cloneNode(true) as DocumentFragment;
      const colEl = colClone.firstElementChild as HTMLElement;

      colEl.querySelector('.column-title')!.textContent = column.title;
      colEl.dataset.columnId = column.id;

      // Drag and drop on column
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        colEl.classList.add('drag-over');
      });

      colEl.addEventListener('dragleave', () => {
        colEl.classList.remove('drag-over');
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('drag-over');
        const cardId = e.dataTransfer?.getData('text/plain');
        if (cardId) {
          this.store.moveCard(cardId, column.id);
          this.render();
        }
      });

      // Render cards in this column
      const cardList = colEl.querySelector('.card-list') as HTMLElement;
      const cards = this.store.getCards(column.id);

      for (const card of cards) {
        const cardTemplate = document.getElementById('card-template') as HTMLTemplateElement;
        const cardClone = cardTemplate.content.cloneNode(true) as DocumentFragment;
        const cardEl = cardClone.firstElementChild as HTMLElement;

        cardEl.querySelector('.card-title')!.textContent = card.title;
        const descEl = cardEl.querySelector('.card-description') as HTMLElement;
        if (descEl) {
          descEl.textContent = card.description;
        }
        cardEl.dataset.cardId = card.id;
        cardEl.setAttribute('draggable', 'true');

        cardEl.addEventListener('dragstart', (e) => {
          e.dataTransfer?.setData('text/plain', card.id);
        });

        // Edit button
        const editBtn = cardEl.querySelector('.card-edit-btn') as HTMLButtonElement;
        editBtn.addEventListener('click', () => {
          this.openEditor(column.id, card.id);
        });

        // Delete button
        const deleteBtn = cardEl.querySelector('.card-delete-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', () => {
          this.store.deleteCard(card.id);
          this.render();
        });

        cardList.appendChild(cardEl);
      }

      // Add card button
      const addBtn = colEl.querySelector('.column-add-btn') as HTMLButtonElement;
      addBtn.addEventListener('click', () => {
        this.openEditor(column.id, null);
      });

      columnsContainer.appendChild(colEl);
    }
  }

  private openEditor(columnId: string, cardId: string | null): void {
    // Create a container for the editor overlay
    this.editorContainer = document.createElement('div');
    document.body.appendChild(this.editorContainer);

    new CardEditor(this.editorContainer, this.store, columnId, cardId, () => {
      this.closeEditor();
      this.render();
    });
  }

  private closeEditor(): void {
    if (this.editorContainer) {
      this.editorContainer.remove();
      this.editorContainer = null;
    }
  }
}
