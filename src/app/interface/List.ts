import { Card } from './Card';

export interface List {
  listTitle: string;
  id: number;
  cards: Card[];
}
