import { Lable } from './Lable';
import { User } from './User';

export interface Card {
  cardTitle: string;
  assignee: User[];
  cardLables: Lable[];
  creator: User;
  id: number;
}
