import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DoctorService } from '../../services/doctor/doctor.service';
import { PatientService } from '../../services/patient/patient.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private doctorService: DoctorService,
              private patientService: PatientService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {

      const message = err.error ?? 'Something went wrong. Try again later.';

      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.patientService.logout();
        this.doctorService.logout();
      }

      throw new Error(message);
    }));
  }
}
