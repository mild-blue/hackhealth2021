import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PatientDetail } from '../../model/PatientDetail';
import { ToastService } from '../../services/toast/toast.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.page.html',
  styleUrls: ['./patient-history.page.scss']
})
export class PatientHistoryPage implements OnInit {

  loading = false;
  public detail?: PatientDetail;

  constructor(private patientService: PatientService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private router: Router) {

  }

  async ngOnInit() {
    if (!this.loading) {
      await this.loadDetail();
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route) => {
      const navigation = route as NavigationEnd;
      if (navigation.url === '/patient/history' && !this.loading) {
        this.loadDetail();
      }
    });
  }

  async loadDetail(): Promise<void> {
    const id = this.patientService.patientValue?.id;
    if (!id) {
      return;
    }

    this.loading = true;
    try {
      this.detail = await this.patientService.getPatientDetail(id);
    } catch (e) {
      this.toastService.error(e.message);
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.patientService.logout();
  }

}
