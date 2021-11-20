import { Component, OnInit } from '@angular/core';
import { Patient } from '../../model/Patient';
import { DoctorService } from '../../services/doctor/doctor.service';

@Component({
  selector: 'app-invite-patient',
  templateUrl: './invite-patient.page.html',
  styleUrls: ['./invite-patient.page.scss'],
})
export class InvitePatientPage implements OnInit {

  patients: Patient[] = [];
  selectedPatient?: Patient;

  constructor(private doctorService: DoctorService) {
  }

  ngOnInit() {
    this.initAllPatients();
  }

  async initAllPatients() {
    try {
      this.patients = await this.doctorService.getAllPatients();
    } catch (e) {

    }
  }

  invitePatient() {

  }
}
