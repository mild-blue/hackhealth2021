import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { PatientService } from '../patient/patient.service';
import { RecordDetail } from '../../model/RecordDetail';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public patientId?: string;

  constructor(private http: HttpClient,
              private patientService: PatientService) {
    this.patientService.patient$.subscribe(patient => this.patientId = patient?.id);
  }

  public async download(id: string): Promise<unknown> {
    return this.http.get<unknown>(
      `${environment.apiUrl}/Patient/data/${id}/csv/pulse_wave`
    ).pipe().toPromise();
  }

  public async uploadVideo(blob: Blob): Promise<string> {
    if (!this.patientId) {
      throw Error('No patient ID specified for upload');
    }

    const formData = new FormData();
    formData.append('file', blob);

    return this.http.post<RecordDetail>(
      `${environment.apiUrl}/Patient/${this.patientId}/submit`,
      formData
    ).pipe(
      map(data => data.id)
    ).toPromise();
  }

  async getRecord(id: string) {

  }
}
