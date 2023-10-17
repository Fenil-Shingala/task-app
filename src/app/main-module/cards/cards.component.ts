import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/interface/Card';
import { List } from 'src/app/interface/List';
import { User } from 'src/app/interface/User';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CardModalComponent } from '../modals/card-modal/card-modal.component';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  @Input() loginUser!: User;
  @Input() currentList!: List;
  @Input() cards!: Card[];
  @Output() filterList = new EventEmitter();

  filteredLists: List[] = [];

  constructor(
    private modal: NzModalService,
    private cardService: CardServiceService
  ) {}

  ngOnInit() {}

  showModal(data?: List, card?: Card, editCard?: boolean): void {
    const cardDialog = this.modal.create({
      nzTitle: `${editCard ? 'Edit' : 'Add'} card`,
      nzContent: CardModalComponent,
      nzFooter: null,
      nzData: editCard
        ? { cardData: card, listId: data?.id, editData: true }
        : { listData: data, editData: false },
    });
    cardDialog.afterClose.subscribe(() => {
      this.filterList.emit();
    });
  }

  deletCard(listId: number, cardId: number): void {
    this.cardService.deleteCard(listId, cardId).subscribe({
      next: () => {
        this.filterList.emit();
      },
      error: () => {},
    });
  }
}
