import { Component } from '@angular/core';
import { List } from 'src/app/interface/List';
import { User } from 'src/app/interface/User';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListModalComponent } from '../modals/list-modal/list-modal.component';
import { ListServiceService } from 'src/app/services/api-service/list-service/list-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent {
  loginUser!: User;
  filteredLists: List[] = [];

  constructor(
    private modal: NzModalService,
    private sharedService: SharedServiceService,
    private listService: ListServiceService
  ) {}

  ngOnInit() {
    this.loginUser = this.sharedService.getLoginUser() as User;
    this.getAllLists();
  }

  getAllLists(): void {
    this.listService.getList().subscribe({
      next: (value) => {
        const filterLists = value.map((list) => {
          const filteredCards = list.cards.filter((card) => {
            const isAssignee = card.assignee.some(
              (assignee) => assignee.email === this.loginUser.email
            );
            const isCreator = card.creator.email === this.loginUser.email;
            return isAssignee || isCreator;
          });
          return {
            ...list,
            cards: filteredCards,
          };
        });
        this.filteredLists = filterLists;
      },
      error: () => {},
    });
  }

  showModal(data?: List): void {
    const listDialog = this.modal.create({
      nzTitle: `${data ? 'Edit' : 'Add'} list`,
      nzContent: ListModalComponent,
      nzFooter: null,
      nzData: data,
    });
    listDialog.afterClose.subscribe(() => {
      this.getAllLists();
    });
  }

  deleteList(listId: number): void {
    this.listService.deleteList(listId).subscribe({
      next: () => {
        this.getAllLists();
      },
      error: () => {},
    });
  }
}
