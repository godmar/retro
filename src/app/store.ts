export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}

const STORAGE_KEY = 'retro-kanban';

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export class Store {
  private state: BoardState;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.state = { columns: DEFAULT_COLUMNS, cards: [] };
    }
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getColumns(): Column[] {
    return this.state.columns;
  }

  getCards(columnId: string): Card[] {
    return this.state.cards.filter((c) => c.columnId === columnId);
  }

  addCard(columnId: string, title: string, description: string): Card {
    const card: Card = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
    };
    this.state.cards.push(card);
    this.save();
    return card;
  }

  updateCard(id: string, updates: Partial<Card>): void {
    const card = this.state.cards.find((c) => c.id === id);
    if (card) {
      Object.assign(card, updates);
      this.save();
    }
  }

  deleteCard(id: string): void {
    this.state.cards = this.state.cards.filter((c) => c.id !== id);
    this.save();
  }

  moveCard(cardId: string, targetColumnId: string): void {
    this.updateCard(cardId, { columnId: targetColumnId });
  }

  getCard(id: string): Card | undefined {
    return this.state.cards.find((c) => c.id === id);
  }
}
