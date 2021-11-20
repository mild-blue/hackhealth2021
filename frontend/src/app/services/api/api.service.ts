import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public async uploadVideo(blob: Blob, sessionId: string = '94ec6e52-ead6-4467-84ca-94267f5b0e1b') {
    const formData = new FormData();
    formData.append('file', blob);

    return this.http.post(
      `${environment.apiUrl}/Patient/${sessionId}/submit`,
      formData
    ).pipe(
      map((response: unknown) => {
        console.log('response', response);
      })
    ).toPromise();
  }
}
