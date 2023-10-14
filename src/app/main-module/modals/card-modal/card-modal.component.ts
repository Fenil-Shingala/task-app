import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/interface/Card';
import { Lable } from 'src/app/interface/Lable';
import { List } from 'src/app/interface/List';
import { User } from 'src/app/interface/User';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { LableServiceService } from 'src/app/services/api-service/lable-service/lable-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent {
  listOfAssignee: string[] = [];
  listOfLables: string[] = [];
  allLables: Lable[] = [];
  allUsers: User[] = [];
  loginUser!: User;
  cardForm!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private cardFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private lableService: LableServiceService,
    private cardService: CardServiceService,
    private modalService: NzModalService,
    @Inject(NZ_MODAL_DATA)
    public data: {
      cardData: Card;
      listData: List;
      listId: number;
      editData: boolean;
    }
  ) {}

  ngOnInit() {
    this.cardForm = this.cardFormBuilder.group({
      cardTitle: ['', [Validators.required, noSpace.noSpaceValidator]],
      assignee: [[]],
      cardLables: [[]],
    });
    this.getAllUsers();
    this.getAllLables();
    this.loginUser = this.sharedService.getLoginUser();
    if (this.data.editData) {
      this.cardForm.controls['cardTitle'].patchValue(
        this.data.cardData.cardTitle
      );
      const assigneeList = this.data.cardData.assignee.map((value) => {
        return value.email;
      });
      this.listOfAssignee = assigneeList;
      const cardLablesList = this.data.cardData.cardLables.map((value) => {
        return value.lableName;
      });
      this.listOfLables = cardLablesList;
    }
  }

  uuid(): string {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .toUpperCase()
      .substring(1);
  }

  getAllUsers(): void {
    this.userService.getUserData().subscribe({
      next: (value) => {
        this.allUsers = value;
      },
      error: () => {},
    });
  }

  getAllLables(): void {
    this.lableService.getAllLables().subscribe({
      next: (value) => {
        this.allLables = value;
      },
      error: () => {},
    });
  }

  submit(): void {
    const newCardLables = this.cardForm.controls['cardLables'].value.map(
      (value: string) => {
        const filterLable = this.allLables.find(
          (lable) => lable.lableName === value
        );
        return filterLable;
      }
    );
    const newAssignee = this.cardForm.controls['assignee'].value.map(
      (item: string) => {
        const filterUser = this.allUsers.find((value) => {
          return item === value.email;
        });
        return filterUser;
      }
    );

    const updatedCard = {
      ...this.cardForm.value,
      id: this.data.editData
        ? this.data.cardData.id
        : `${this.uuid()}${this.uuid()}`,
      cardTitle: this.cardForm.controls['cardTitle'].value.trim(),
      creator: this.data.editData
        ? this.data.cardData.creator
        : this.sharedService.getLoginUser(),
      cardLables: this.data.editData
        ? newCardLables
        : this.cardForm.controls['cardLables'].value,
      assignee: this.data.editData
        ? newAssignee
        : this.cardForm.controls['assignee'].value,
    };

    if (this.data.editData) {
      this.cardService
        .updateCard(this.data.listId, this.data.cardData.id, updatedCard)
        .subscribe({
          next: () => {
            this.toastr.success('Card updated successfully', 'Card updated');
            this.modalService.closeAll();
          },
          error: () => {},
        });
    } else {
      this.cardService.addcard(updatedCard, this.data.listData.id).subscribe({
        next: () => {
          this.toastr.success('Card added successfully', 'Card added');
          this.modalService.closeAll();
        },
        error: () => {},
      });
    }
  }

  closeModal(): void {
    this.modalService.closeAll();
  }
}
