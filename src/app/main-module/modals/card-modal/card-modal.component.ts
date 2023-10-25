import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { Card } from 'src/app/interface/Card';
import { Label } from 'src/app/interface/Label';
import { List } from 'src/app/interface/List';
import { User } from 'src/app/interface/User';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { LabelServiceService } from 'src/app/services/api-service/lable-service/lable-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent {
  @ViewChild('cardInput') cardInput!: ElementRef;
  listOfAssignee: string[] = [];
  listOfLabels: string[] = [];
  allLabels: Label[] = [];
  allUsers: User[] = [];
  loginUser!: User;
  cardForm!: FormGroup;

  constructor(
    private cardFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private labelService: LabelServiceService,
    private cardService: CardServiceService,
    private modalService: NzModalService,
    private message: NzMessageService,
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
      cardLabels: [[]],
    });
    this.getAllUsers();
    this.getAllLabels();
    this.loginUser = this.sharedService.getLoginUser() as User;
    if (this.data.editData) {
      this.cardForm.controls['cardTitle'].patchValue(
        this.data.cardData.cardTitle
      );
      const assigneeList = this.data.cardData.assignee.map((value) => {
        return value.email;
      });
      this.listOfAssignee = assigneeList;
      const cardlabelsList = this.data.cardData.cardLabels.map((value) => {
        return value.labelName;
      });
      this.listOfLabels = cardlabelsList;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cardInput.nativeElement.focus();
    }, 300);
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

  getAllLabels(): void {
    this.labelService.getAllLabels().subscribe({
      next: (value) => {
        this.allLabels = value;
      },
      error: () => {},
    });
  }

  submit(): void {
    if (this.cardForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.cardForm);
      return;
    }
    const newCardlabels = this.cardForm.controls['cardLabels'].value.map(
      (value: string) => {
        const filterLabel = this.allLabels.find(
          (label) => label.labelName === value
        );
        return filterLabel;
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
      cardLabels: this.data.editData
        ? newCardlabels
        : this.cardForm.controls['cardLabels'].value,
      assignee: this.data.editData
        ? newAssignee
        : this.cardForm.controls['assignee'].value,
    };

    if (this.data.editData) {
      this.cardService
        .editCard(this.data.listId, this.data.cardData.id, updatedCard)
        .subscribe({
          next: () => {
            this.message.success('Card updated');
            this.modalService.closeAll();
          },
          error: () => {},
        });
    } else {
      this.cardService
        .updatecard(updatedCard, this.data.listData.id)
        .subscribe({
          next: () => {
            this.message.success('Card added');
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
