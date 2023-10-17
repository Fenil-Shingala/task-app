import { MainModuleComponent } from './main-module.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListModalComponent } from './modals/list-modal/list-modal.component';
import { CardModalComponent } from './modals/card-modal/card-modal.component';
import { LabelModalComponent } from './modals/label-modal/label-modal.component';
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
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ListsComponent } from './lists/lists.component';
import { CardsComponent } from './cards/cards.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    MainModuleComponent,
    DashboardComponent,
    ListModalComponent,
    LabelModalComponent,
    CardModalComponent,
    TopBarComponent,
    ListsComponent,
    CardsComponent,
    ChangePasswordComponent,
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
    NzMessageModule,
    NzPopconfirmModule,
    DragDropModule,
    NzTagModule,
  ],
})
export class MainModuleModule {}
