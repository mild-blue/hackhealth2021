import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  selector: 'app-measurement-detail',
  templateUrl: './measurement-detail.page.html',
  styleUrls: ['./measurement-detail.page.scss']
})
export class MeasurementDetailPage implements OnInit {

  id?: string;
  backText = this.doctorService.isDoctorLoggedIn ? 'Back' : 'My history';

  constructor(private activatedRoute: ActivatedRoute,
              private api: ApiService,
              private toastService: ToastService,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private router: Router) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('code') ?? undefined;

    if (!this.id) {
      return;
    }

    this.loadRecord();
  }

  async loadRecord(): Promise<void> {
    if (!this.id) {
      return;
    }

    try {
      await this.api.getRecord(this.id);
    } catch (e) {
      this.toastService.error(e.message);
    }
  }

  public goBack(): void {
    if (this.doctorService.isDoctorLoggedIn) {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['/patient/history'], { replaceUrl: true });
    }
  }
}
