import { Label } from './Label';
import { User } from './User';

export interface Card {
  cardTitle: string;
  assignee: User[];
  cardLabels: Label[];
  creator: User;
  id: number;
}
