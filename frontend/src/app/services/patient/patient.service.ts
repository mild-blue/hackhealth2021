import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../../model/Patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientSubject: BehaviorSubject<Patient | undefined> = new BehaviorSubject<Patient | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.setCurrentPatient();
  }

  public loginAnonymously(): Patient {
    const patient: Patient = { id: '1' };
    this.login(patient);
    return patient;
  }

  public async acceptInvitation(invitationCode: string): Promise<Patient> {
    return this.http.post(
      `${environment.apiUrl}/Patient/accept`,
      {
        invitationCode
      }
    ).pipe(
      map((response: unknown) => {
        const patient = response as Patient;
        this.login(patient);
        return patient;
      })
    ).toPromise();
  }

  private setCurrentPatient(): void {
    const lsPatient = localStorage.getItem('patient');
    if (lsPatient) {
      const patient = JSON.parse(lsPatient);
      this.login(patient);
    }
  }

  private login(patient: Patient): void {
    localStorage.setItem('patient', JSON.stringify(patient));
    this.patientSubject.next(patient);
  }

  get patient$(): Observable<Patient | undefined> {
    return this.patientSubject.asObservable();
  }

  get patientValue(): Patient | undefined {
    return this.patientSubject.value;
  }

  get isPatientLoggedIn(): boolean {
    const patient = this.patientSubject.value;
    return !!patient;
  }
}
