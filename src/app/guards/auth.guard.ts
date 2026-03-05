import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthRoute = state.url === '/auth';

    // If user is authenticated and trying to access auth page, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // If user is not authenticated and trying to access protected route, redirect to auth
    if (!isAuthenticated && !isAuthRoute) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}
