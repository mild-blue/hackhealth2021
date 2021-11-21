import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { PatientService } from '../../services/patient/patient.service';
import { RecordDetail } from '../../model/RecordDetail';
import { NavController } from '@ionic/angular';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-measurement-detail',
  templateUrl: './measurement-detail.page.html',
  styleUrls: ['./measurement-detail.page.scss']
})
export class MeasurementDetailPage implements OnInit {

  isDoctor = this.doctorService.isDoctorLoggedIn;

  record?: RecordDetail;
  loading = false;

  id?: string;
  backText = this.isDoctor ? 'Back' : 'My history';
  patientName?: string;
  doctorName?: string;

  constructor(private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private navController: NavController) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('recordId') ?? undefined;
    this.patientName = this.activatedRoute.snapshot.paramMap.get('name') ?? undefined;

    if (!this.isDoctor) {
      this.doctorName = this.patientService.patientValue?.doctor?.name ?? '';
    }

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
    if (this.isDoctor) {
      const patientId = this.activatedRoute.snapshot.paramMap.get('id');
      if (patientId && this.patientName) {
        this.navController.navigateBack(`/patient-detail/${patientId}/${this.patientName}`);
      } else {
        this.navController.navigateBack(`/patient-detail`);
      }
    } else {
      this.navController.navigateBack('/patient/history');
    }
  }

  async downloadCSVPeaks() {
    try {
      const blob = await fetch(`${environment.apiUrl}/Patient/data/${this.id}/csv/peaks`);
      const text = await blob.text();

      const location = await this.saveFile(text, 'Peak points');
      this.toastService.success(`Successfully saved file as ${location}`);
    } catch (e) {
      this.toastService.error(e.message);
    }
  }

  async downloadCSVDistances() {
    try {
      const blob = await fetch(`${environment.apiUrl}/Patient/data/${this.id}/csv/distances`);
      const text = await blob.text();

      const location = await this.saveFile(text, 'RR tachogram');
      this.toastService.success(`Successfully saved file as ${location}`);
    } catch (e) {
      this.toastService.error(e.message);
    }
  }

  async downloadCSVPulseWave() {
    try {
      const blob = await fetch(`${environment.apiUrl}/Patient/data/${this.id}/csv/pulse_wave`);
      const text = await blob.text();

      const location = await this.saveFile(text, 'Pulse Wave');
      this.toastService.success(`Successfully saved file as ${location}`);
    } catch (e) {
      this.toastService.error(e.message);
    }
  }

  async saveFile(data: string, type: string): Promise<string> {
    const date = moment(this.record.date).format('DD.MM.YYYY');
    const subDir = this.patientName ? `${this.patientName}/${this.record.created}` : (this.patientService.patientValue.name ? `${this.patientName}/${date}` : `${date}`);

    const path = `Export/${subDir}/${type}.csv`;
    await Filesystem.writeFile({
      path,
      data,
      directory: Directory.Documents,
      recursive: true,
      encoding: Encoding.UTF8
    });

    return path;
  }
}
