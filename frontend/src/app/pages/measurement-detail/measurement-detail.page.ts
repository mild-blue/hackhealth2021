import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { PatientService } from '../../services/patient/patient.service';
import { RecordDetail } from '../../model/RecordDetail';

@Component({
  selector: 'app-measurement-detail',
  templateUrl: './measurement-detail.page.html',
  styleUrls: ['./measurement-detail.page.scss']
})
export class MeasurementDetailPage implements OnInit {

  record?: RecordDetail;
  loading = false

  id?: string;
  backText = this.doctorService.isDoctorLoggedIn ? 'Back' : 'My history';

  constructor(private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private router: Router) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('recordId') ?? undefined;

    if (!this.id) {
      return;
    }

    this.loadRecord();
  }

  async loadRecord(): Promise<void> {
    if (!this.id) {
      return;
    }

    this.loading = true;
    try {
      this.record = await this.patientService.getPatientRecord(this.id);
    } catch (e) {
      this.toastService.error(e.message);
    } finally {
      this.loading = false;
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
