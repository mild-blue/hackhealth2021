import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../../model/Patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PatientDetail } from '../../model/PatientDetail';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientSubject: BehaviorSubject<Patient | undefined> = new BehaviorSubject<Patient | undefined>(undefined);

  constructor(private http: HttpClient,
              private router: Router) {
    this.setCurrentPatient();
  }

  public loginAnonymously(): Patient {
    const patient: Patient = { id: '1' };
    this.login(patient);
    return patient;
  }

  public logout(): void {
    this.patientSubject.next(undefined);
    localStorage.removeItem('patient');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  public async getPatientDetail(id: string): Promise<PatientDetail> {
    return this.http.get<PatientDetail>(
      `${environment.apiUrl}/Patient/${id}`
    ).pipe(
      map(data => {
        data.data = [...data.data.map(record => {
          record.date = new Date(record.created);
          return record;
        })];
        return data;
      })
    ).toPromise();
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
