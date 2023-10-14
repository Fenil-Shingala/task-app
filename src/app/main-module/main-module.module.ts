import { MainModuleComponent } from './main-module.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListModalComponent } from './modals/list-modal/list-modal.component';
import { CardModalComponent } from './modals/card-modal/card-modal.component';
import { LableModalComponent } from './modals/lable-modal/lable-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModuleRoutingModule } from './main-module-routing.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    MainModuleComponent,
    DashboardComponent,
    ListModalComponent,
    LableModalComponent,
    CardModalComponent,
  ],
  imports: [
    CommonModule,
    MainModuleRoutingModule,
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzBadgeModule,
    NzCardModule,
    NzModalModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzTableModule,
    NzSelectModule,
    NzPopconfirmModule,
    DragDropModule,
  ],
})
export class MainModuleModule {}
