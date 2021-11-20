import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PatientService } from '../../services/patient/patient.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss']
})
export class VerifyPage implements OnInit {

  code?: string;

  constructor(private navController: NavController,
              private patientService: PatientService,
              private toastService: ToastService) {
  }

  ngOnInit() {
  }

  continueWithoutCode() {
    this.patientService.loginAnonymously();
    this.navController.navigateRoot(['/patient']);
  }

  async verify() {
    if (!this.code) {
      return;
    }

    try {
      await this.patientService.acceptInvitation(this.code);
      this.toastService.success('Code successfully verified');
      this.navController.navigateRoot(['/patient']);
    } catch (e) {
      this.toastService.error(e.message);
    }
  }

}
