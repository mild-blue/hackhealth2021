import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../../model/Doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorSubject: BehaviorSubject<Doctor | undefined> = new BehaviorSubject<Doctor | undefined>(undefined);

  constructor() {
    this.setCurrentDoctor();
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
