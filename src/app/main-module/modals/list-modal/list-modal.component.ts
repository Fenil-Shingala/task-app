import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { List } from 'src/app/interface/List';
import { ListServiceService } from 'src/app/services/api-service/list-service/list-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss'],
})
export class ListModalComponent {
  allLists: List[] = [];
  listForm!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private addListFormBuilder: FormBuilder,
    private listService: ListServiceService,
    private modalService: NzModalService,
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
    this.editListData
      ? this.listForm.controls['listTitle'].patchValue(
          this.editListData.listTitle
        )
      : '';
  }

  getAllLists(): void {
    this.listService.getList().subscribe({
      next: (value) => {
        this.allLists = value;
      },
      error: () => {},
    });
  }

  addListSubmit(): void {
    const updatedList = {
      ...this.listForm.value,
      listTitle: this.listForm.value.listTitle.toUpperCase().trim(),
      cards: this.editListData ? this.editListData.cards : [],
    };
    if (this.editListData) {
      this.listService.updateList(updatedList, this.editListData.id).subscribe({
        next: () => {
          this.toastr.success('List updated successfully', 'List updated');
          this.modalService.closeAll();
        },
        error: () => {},
      });
    } else {
      this.listService.addList(updatedList).subscribe({
        next: () => {
          this.toastr.success('List added successfully', 'List added');
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
