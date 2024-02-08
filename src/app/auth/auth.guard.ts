import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    const router = inject(Router);
    const cookies = inject(CookieService);

    if(cookies.check('_ssU') == true){
      return true;
    }
    else{
      router.navigate(['/login']);
      return false;
    }
};