import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListModalComponent } from '../modals/list-modal/list-modal.component';
import { LableModalComponent } from '../modals/lable-modal/lable-modal.component';
import { CardModalComponent } from '../modals/card-modal/card-modal.component';
import { ListServiceService } from 'src/app/services/api-service/list-service/list-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { List } from 'src/app/interface/List';
import { User } from 'src/app/interface/User';
import { Card } from 'src/app/interface/Card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  boardMember = false;
  value!: string;
  allLists: List[] = [];
  filteredLists: List[] = [];
  allUserData: User[] = [];
  firstFiveUsers: User[] = [];
  loginUser!: User;
  addListForm!: FormGroup;

  constructor(
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private listService: ListServiceService,
    private cardService: CardServiceService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.loginUser = this.sharedService.getLoginUser();
    this.getAllLists();
    this.userData();
  }

  // onDrop(event: CdkDragDrop<{ dropCards: Card[]; listId: number }>): void {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data.dropCards,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data.dropCards,
  //       event.container.data.dropCards,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  //   // this.userService
  //   //   .updateCardToDrag(
  //   //     this.loginUser.id,
  //   //     event.container.data.listId,
  //   //     event.previousContainer.data.listId,
  //   //     event.container.data.dropCards,
  //   //     event.previousContainer.data.dropCards
  //   //   )
  //   //   .subscribe({
  //   //     next: () => {},
  //   //     error: () => {},
  //   //   });

  //   this.cardService
  //     .updateCardFromDrag(
  //       event.previousContainer.data.listId,
  //       event.previousContainer.data.dropCards
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.cardService
  //           .updateCardToDrag(
  //             event.container.data.listId,
  //             event.container.data.dropCards
  //           )
  //           .subscribe({
  //             next: () => {},
  //             error: () => {},
  //           });
  //       },
  //       error: () => {},
  //     });
  // }

  userData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.firstFiveUsers = [];
        this.allUserData = data;
        data.map((user, index) => {
          index < 5 ? this.firstFiveUsers.push(user) : null;
        });
      },
      error: () => {},
    });
  }

  getAllLists(): void {
    this.listService.getList().subscribe({
      next: (value) => {
        this.allLists = value;
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

  showModal(
    dialog: string,
    data?: List,
    card?: Card,
    editCard?: boolean
  ): void {
    if (dialog === 'lableDialog') {
      const lableDialog = this.modal.create({
        nzContent: LableModalComponent,
        nzFooter: null,
        nzStyle: { top: '20px' },
      });
    } else if (dialog === 'listDialog') {
      const listDialog = this.modal.create({
        nzTitle: `${data ? 'Edit' : 'Add'} list`,
        nzContent: ListModalComponent,
        nzFooter: null,
        nzData: data,
      });
      listDialog.afterClose.subscribe(() => {
        this.getAllLists();
      });
    } else if (dialog === 'cardDialog') {
      const cardDialog = this.modal.create({
        nzTitle: `${editCard ? 'Edit' : 'Add'} card`,
        nzContent: CardModalComponent,
        nzFooter: null,
        nzData: editCard
          ? { cardData: card, listId: data?.id, editData: true }
          : { listData: data, editData: false },
      });
      cardDialog.afterClose.subscribe(() => {
        this.getAllLists();
      });
    } else if (dialog === 'boardMemberDialog') {
      this.boardMember = true;
    }
  }

  deletCard(listId: number, cardId: number): void {
    this.cardService.deleteCard(listId, cardId).subscribe({
      next: () => {
        this.getAllLists();
      },
      error: () => {},
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

  closeMemberDialog(): void {
    this.boardMember = false;
  }

  logout(): void {
    localStorage.removeItem('loginUser');
    this.route.navigate(['/auth-module/login']);
  }

  reloadPage(): void {
    window.location.reload();
  }
}
