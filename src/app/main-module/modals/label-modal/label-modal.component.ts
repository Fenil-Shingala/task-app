import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Label } from 'src/app/interface/Label';
import { LabelServiceService } from 'src/app/services/api-service/lable-service/lable-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss'],
})
export class LabelModalComponent {
  formSubmitted = false;
  labelColors = [
    'red',
    'green',
    'gold',
    'magenta',
    'blue',
    'orange',
    'lime',
    'purple',
    'cyan',
  ];
  alllabels: Label[] = [];
  editlabelData!: Label | undefined;
  labelForm!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private labelFormBuilder: FormBuilder,
    private labelService: LabelServiceService
  ) {}

  ngOnInit() {
    this.getAlllabels();
    this.addlabelForm();
  }

  addlabelForm(editListData?: Label): void {
    this.labelForm = this.labelFormBuilder.group({
      labelName: ['', [Validators.required, noSpace.noSpaceValidator]],
      labelColor: ['', [Validators.required]],
    });

    if (editListData) {
      this.labelForm.controls['labelName'].patchValue(editListData.labelName);
      this.labelForm.controls['labelColor'].patchValue(editListData.labelColor);
    } else {
    }
  }

  getAlllabels(): void {
    this.labelService.getAllLabels().subscribe({
      next: (value) => {
        this.alllabels = value;
      },
      error: () => {},
    });
  }

  submit(): void {
    const updatedlabel = {
      ...this.labelForm.value,
      labelName: this.labelForm.value.labelName.trim(),
    };

    if (this.editlabelData) {
      this.labelService
        .updateLabel(this.labelForm.value, this.editlabelData.id)
        .subscribe({
          next: () => {
            this.getAlllabels();
            this.toastr.success('label updated successfully', 'label updated');
            this.resetForm();
          },
          error: () => {},
        });
    } else {
      this.labelService.addLabels(updatedlabel).subscribe({
        next: () => {
          this.toastr.success('label added successfully', 'label added');
          this.getAlllabels();
          this.resetForm();
        },
        error: () => {},
      });
    }
  }

  resetForm(): void {
    this.labelForm.reset();
    this.editlabelData = undefined;
  }

  editlabel(labelData: Label): void {
    this.addlabelForm(labelData);
    this.editlabelData = labelData;
  }

  deletelabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.getAlllabels();
        this.labelForm.reset();
      },
    });
  }
}
