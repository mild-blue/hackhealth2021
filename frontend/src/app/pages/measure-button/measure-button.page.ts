import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  selector: 'app-measure-button',
  templateUrl: './measure-button.page.html',
  styleUrls: ['./measure-button.page.scss'],
})
export class MeasureButtonPage implements OnInit {

  constructor(private patientService: PatientService) { }

  ngOnInit() {
  }

  logout() {
    this.patientService.logout();
  }
}
