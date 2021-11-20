import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../../model/Doctor';
import { Patient } from '../../model/Patient';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorSubject: BehaviorSubject<Doctor | undefined> = new BehaviorSubject<Doctor | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.setCurrentDoctor();
  }

  public async getMyPatients(): Promise<Patient[]> {
    return this.http.get<Patient[]>(
      `${environment.apiUrl}/Doctor/mine`
    ).pipe().toPromise();
  }

  public async getAllPatients(): Promise<Patient[]> {
    return this.http.get<Patient[]>(
      `${environment.apiUrl}/Doctor/all`
    ).pipe().toPromise();
  }

  public async invitePatient(patientId: string, invitationCode: string): Promise<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/Doctor/invite`,
      {
        doctorId: this.doctorSubject.value.id,
        patientId,
        invitationCode
      }
    ).pipe().toPromise();
  }

  public loginAsDoctor(): Doctor {
    const doctor: Doctor = { id: '1011', name: 'Dr. Magdalene960 Parisian75' };
    this.login(doctor);
    return doctor;
  }

  private setCurrentDoctor(): void {
    const lsDoctor = localStorage.getItem('doctor');
    if (lsDoctor) {
      const doctor = JSON.parse(lsDoctor);
      this.login(doctor);
    }
  }

  private login(doctor: Doctor): void {
    localStorage.setItem('doctor', JSON.stringify(doctor));
    this.doctorSubject.next(doctor);
  }

  get doctor$(): Observable<Doctor | undefined> {
    return this.doctorSubject.asObservable();
  }

  get doctorValue(): Doctor | undefined {
    return this.doctorSubject.value;
  }

  get isDoctorLoggedIn(): boolean {
    const doctor = this.doctorSubject.value;
    return !!doctor;
  }
}
