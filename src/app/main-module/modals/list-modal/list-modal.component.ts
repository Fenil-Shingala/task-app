import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { List } from 'src/app/interface/List';
import { ListServiceService } from 'src/app/services/api-service/list-service/list-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss'],
})
export class ListModalComponent {
  @ViewChild('listInput') listInput!: ElementRef;
  allLists: List[] = [];
  listForm!: FormGroup;

  constructor(
    private addListFormBuilder: FormBuilder,
    private sharedService: SharedServiceService,
    private listService: ListServiceService,
    private modalService: NzModalService,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) public editListData: List
  ) {}

  ngOnInit() {
    this.listForm = this.addListFormBuilder.group({
      listTitle: [
        '',
        [
          Validators.required,
          noSpace.noSpaceValidator,
          this.checkDuplicateTitle(),
        ],
      ],
    });
    this.getAllLists();
    this.editListData && this.editListData.listTitle
      ? this.listForm.controls['listTitle'].patchValue(
          this.editListData.listTitle.toUpperCase().trim()
        )
      : '';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.listInput.nativeElement.focus();
    }, 300);
  }

  getAllLists(): void {
    this.listService.getList().subscribe({
      next: (value) => {
        this.allLists = value;
      },
      error: () => {},
    });
  }

  submit(): void {
    if (this.listForm.invalid) {
      this.sharedService.showErrorOnSubmit(this.listForm);
      return;
    }
    const updatedList = {
      ...this.listForm.value,
      listTitle: this.listForm.value.listTitle.toUpperCase().trim(),
      cards: this.editListData ? this.editListData.cards : [],
    };
    if (this.editListData) {
      this.listService.updateList(updatedList, this.editListData.id).subscribe({
        next: () => {
          this.message.success('List updated');
          this.modalService.closeAll();
        },
        error: () => {},
      });
    } else {
      this.listService.addList(updatedList).subscribe({
        next: () => {
          this.message.success('List added');
          this.modalService.closeAll();
        },
        error: () => {},
      });
    }
  }

  closeModal(): void {
    this.modalService.closeAll();
  }

  checkDuplicateTitle(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const uniqueList = this.allLists.find(
        (checkList) =>
          checkList?.listTitle.trim() === control.value.toUpperCase().trim()
      );
      if (this.editListData?.listTitle === control.value.toUpperCase().trim()) {
        return null;
      } else {
        return uniqueList ? { duplicateTitleError: true } : null;
      }
    };
  }
}
