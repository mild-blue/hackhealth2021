import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Patient } from '../../model/Patient';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.page.html',
  styleUrls: ['./doctor-home.page.scss']
})
export class DoctorHomePage implements OnInit {

  patients: Patient[] = [];
  loading = false;

  constructor(private doctorService: DoctorService) {
  }

  ngOnInit() {
    this.initMyPatients();
  }

  async initMyPatients() {
    this.loading = true;
    try {
      this.patients = await this.doctorService.getMyPatients();
    } catch (e) {

    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.doctorService.logout();
  }
}
