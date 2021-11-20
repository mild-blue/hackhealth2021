import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss']
})
export class VerifyPage implements OnInit {

  constructor(private navController: NavController,
              private patientService: PatientService) {
  }

  ngOnInit() {
  }

  continueWithoutCode() {
    this.patientService.loginAnonymously();
    this.navController.navigateRoot(['/patient']);
  }

  async verify() {
    try {
      await this.patientService.acceptInvitation('');
      this.navController.navigateRoot(['/patient']);
    } catch (e) {
      console.log(e);
    }
  }

}
