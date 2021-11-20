import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.page.html',
  styleUrls: ['./patient-history.page.scss']
})
export class PatientHistoryPage implements OnInit {

  constructor(private patientService: PatientService) {
  }

  ngOnInit() {
  }

  logout() {
    this.patientService.logout();
  }

}
