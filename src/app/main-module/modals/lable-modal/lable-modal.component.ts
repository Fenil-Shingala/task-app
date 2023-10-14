import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Lable } from 'src/app/interface/Lable';
import { LableServiceService } from 'src/app/services/api-service/lable-service/lable-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-lable-modal',
  templateUrl: './lable-modal.component.html',
  styleUrls: ['./lable-modal.component.scss'],
})
export class LableModalComponent {
  formSubmitted = false;
  lableColors = ['red', 'green', 'yellow', 'gray', 'blue', 'orange'];
  allLables: Lable[] = [];
  editLableData!: Lable | undefined;
  lableForm!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private lableFormBuilder: FormBuilder,
    private lableService: LableServiceService
  ) {}

  ngOnInit() {
    this.getAllLables();
    this.addLableForm();
  }

  addLableForm(editListData?: Lable): void {
    this.lableForm = this.lableFormBuilder.group({
      lableName: ['', [Validators.required, noSpace.noSpaceValidator]],
      lableColor: ['', [Validators.required]],
    });

    if (editListData) {
      this.lableForm.controls['lableName'].patchValue(editListData.lableName);
      this.lableForm.controls['lableColor'].patchValue(editListData.lableColor);
    } else {
    }
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
    const updatedLable = {
      ...this.lableForm.value,
      lableName: this.lableForm.value.lableName.trim(),
    };

    if (this.editLableData) {
      this.lableService
        .updateLable(this.lableForm.value, this.editLableData.id)
        .subscribe({
          next: () => {
            this.getAllLables();
            this.toastr.success('Lable updated successfully', 'Lable updated');
            this.resetForm();
          },
          error: () => {},
        });
    } else {
      this.lableService.addLables(updatedLable).subscribe({
        next: () => {
          this.toastr.success('Lable added successfully', 'Lable added');
          this.getAllLables();
          this.resetForm();
        },
        error: () => {},
      });
    }
  }

  resetForm(): void {
    this.lableForm.reset();
    this.editLableData = undefined;
  }

  editLable(lableData: Lable): void {
    this.addLableForm(lableData);
    this.editLableData = lableData;
  }

  deleteLable(lableId: number): void {
    this.lableService.deleteLable(lableId).subscribe({
      next: () => {
        this.getAllLables();
        this.lableForm.reset();
      },
    });
  }
}
