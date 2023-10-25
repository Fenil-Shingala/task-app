import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Label } from 'src/app/interface/Label';
import { LabelServiceService } from 'src/app/services/api-service/lable-service/lable-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss'],
})
export class LabelModalComponent {
  @ViewChild('lableInput') lableInput!: ElementRef;
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
    private labelFormBuilder: FormBuilder,
    private labelService: LabelServiceService,
    private message: NzMessageService
  ) {
    this.addlabelForm();
  }

  ngOnInit() {
    this.getAlllabels();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.lableInput.nativeElement.focus();
    }, 300);
  }

  addlabelForm(editListData?: Label): void {
    this.labelForm = this.labelFormBuilder.group({
      labelName: ['', [Validators.required, noSpace.noSpaceValidator]],
      labelColor: ['', [Validators.required]],
    });
    if (editListData) {
      this.labelForm.controls['labelName'].patchValue(editListData.labelName);
      this.labelForm.controls['labelColor'].patchValue(editListData.labelColor);
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
    if (this.labelForm.invalid) {
      return;
    }
    const updatedlabel = {
      ...this.labelForm.value,
      labelName: this.labelForm.value.labelName.trim(),
    };

    if (this.editlabelData) {
      this.labelService
        .updateLabel(this.labelForm.value, this.editlabelData.id)
        .subscribe({
          next: () => {
            this.message.success('Label updated');
          },
          error: () => {},
        });
    } else {
      this.labelService.addLabels(updatedlabel).subscribe({
        next: () => {
          this.message.success('Lable added');
        },
        error: () => {},
      });
    }
    this.getAlllabels();
    this.resetForm();
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
        this.alllabels = this.alllabels.filter(
          (lables) => labelId !== lables.id
        );
        this.message.error('Lable deleted');
        this.labelForm.reset();
      },
    });
  }
}
