import { Component, OnInit } from '@angular/core';
import { PatientDetail } from '../../model/PatientDetail';
import { PatientService } from '../../services/patient/patient.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss']
})
export class PatientDetailPage implements OnInit {

  loading = false;
  public detail?: PatientDetail;

  constructor(private patientService: PatientService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? undefined;

    if (!id) {
      return;
    }

    this.loadDetail(id);
  }

  async loadDetail(id: string): Promise<void> {
    this.loading = true;
    try {
      this.detail = await this.patientService.getPatientDetail(id);
    } catch (e) {
      this.toastService.error(e.message);
    } finally {
      this.loading = false;
    }
  }

}
