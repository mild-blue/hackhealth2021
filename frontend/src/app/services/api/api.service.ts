import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { PatientService } from '../patient/patient.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public patientId?: string;

  constructor(private http: HttpClient,
              private patientService: PatientService) {
    this.patientService.patient$.subscribe(patient => this.patientId = patient.id);
  }

  public async uploadVideo(blob: Blob): Promise<string> {
    if (!this.patientId) {
      throw Error('No patient ID specified for upload');
    }

    const formData = new FormData();
    formData.append('file', blob);

    return this.http.post(
      `${environment.apiUrl}/Patient/${this.patientId}/submit`,
      formData
    ).pipe(
      map((response: unknown) => {
        console.log('response', response);

        return '123';
      })
    ).toPromise();
  }

  async getRecord(id: string) {

  }
}
