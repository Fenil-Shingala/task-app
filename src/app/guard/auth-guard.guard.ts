import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedServiceService } from '../services/shared-service/shared-service.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const sharedService = inject(SharedServiceService);
  const router = inject(Router);

  if (sharedService.getLoginUser()) {
    return true;
  } else {
    router.navigate(['/auth-module/login']);
    return false;
  }
};
