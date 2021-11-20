import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor/doctor.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  constructor(private doctorService: DoctorService,
              private navController: NavController) {
  }

  ngOnInit() {
  }

  handleDoctorLogin() {
    this.doctorService.loginAsDoctor();
    this.navController.navigateRoot(['/doctor']);
  }

}
