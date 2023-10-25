import { Component } from '@angular/core';
import { User } from 'src/app/interface/User';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { LabelModalComponent } from '../modals/label-modal/label-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  boardMember = false;
  loginUser!: User;
  allUserData: User[] = [];

  constructor(
    private sharedService: SharedServiceService,
    private userService: UserServiceService,
    private modal: NzModalService,
    private route: Router
  ) {}

  ngOnInit() {
    this.loginUser = this.sharedService.getLoginUser() as User;
    this.getUserData();
  }

  getUserData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.allUserData = data;
      },
      error: () => {},
    });
  }

  showModal(dialog: string) {
    if (dialog === 'labelDialog') {
      this.modal.create({
        nzContent: LabelModalComponent,
        nzFooter: null,
        nzStyle: { top: '20px' },
      });
    } else if (dialog === 'boardMemberDialog') {
      this.boardMember = true;
    }
  }

  closeMemberDialog(): void {
    this.boardMember = false;
  }

  reloadPage(): void {
    window.location.reload();
  }

  logout(): void {
    localStorage.removeItem('loginUser');
    this.route.navigate(['/auth-module/login']);
  }
}
