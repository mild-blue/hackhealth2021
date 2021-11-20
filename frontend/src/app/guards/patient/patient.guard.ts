import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PatientService } from '../../services/user/patient.service';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate {
  constructor(private router: Router,
              private patientService: PatientService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.patientService.isPatientLoggedIn) {
      // logged in, return true
      return true;
    }

    // not logged in, redirect to login page
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

}
