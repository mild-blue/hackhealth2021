import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { DoctorService } from '../../services/doctor/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorGuard implements CanActivate {
  constructor(private router: Router,
              private doctorService: DoctorService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.doctorService.isDoctorLoggedIn) {
      // logged in, return true
      return true;
    }

    // not logged in, redirect to login page
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
