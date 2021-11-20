import { Component, OnInit } from '@angular/core';
import { Patient } from '../../model/Patient';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-invite-patient',
  templateUrl: './invite-patient.page.html',
  styleUrls: ['./invite-patient.page.scss']
})
export class InvitePatientPage implements OnInit {

  patients: Patient[] = [];
  selectedPatient?: Patient;
  loading = false;

  constructor(private doctorService: DoctorService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.initAllPatients();
  }

  async initAllPatients() {
    this.loading = true;
    try {
      this.patients = await this.doctorService.getAllPatients();
    } catch (e) {
      this.toastService.error(e.message);
    } finally {
      this.loading = false;
    }
  }

  async invitePatient() {
    if (!this.selectedPatient) {
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000);

    try {
      await this.doctorService.invitePatient(this.selectedPatient.id, code);
      this.router.navigate(['/invite-patient-success', code, this.selectedPatient.name]);
    } catch (e) {

    }
  }
}
