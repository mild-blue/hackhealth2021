import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { DoctorService } from '../../services/doctor/doctor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private patientService: PatientService,
              private doctorService: DoctorService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.patientService.isPatientLoggedIn) {
      // logged in, return true
      return true;
    } else if (this.doctorService.isDoctorLoggedIn) {
      // redirect to doctor HP
      this.router.navigate(['/doctor'], { replaceUrl: true });
      return false;
    }

    // not logged in, redirect to login page
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
