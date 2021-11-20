import { Component, OnInit } from '@angular/core';
import { CaptureError, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { Filesystem } from '@capacitor/filesystem';
import { ApiService } from '../../services/api/api.service';
import { AlertController } from '@ionic/angular';

interface VideoCapture {
  name: string;
  localURL: string;
  type: string;
  lastModified?: string;
  lastModifiedDate?: number;
  size: number;
  start: number;
  end: number;
  fullPath: string;
}

@Component({
  selector: 'app-heart-capture',
  templateUrl: './heart-capture.page.html',
  styleUrls: ['./heart-capture.page.scss']
})
export class HeartCapturePage implements OnInit {

  constructor(private mediaCapture: MediaCapture,
              private api: ApiService,
              private alertController: AlertController) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    const alert = await this.alertController.create({
      message: `<h3>Please turn on your flashlight</h3>`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.alertCallback();
          }
        }
      ]
    });

    return alert.present();
  }

  async alertCallback() {
    const video = await this.captureVideo();
    const blob = await this.getBlob(video);

    try {
      await this.api.uploadVideo(blob);
    } catch (e) {
      console.log(e);
    }
  }

  async captureVideo(): Promise<VideoCapture> {
    try {
      const result: MediaFile[] | CaptureError = await this.mediaCapture.captureVideo({ duration: 5 });
      if ('code' in result) {
        return;
      }

      const file = (result as MediaFile[])[0];
      const video = file as unknown as VideoCapture;
      console.log('video', video);
      return video;
    } catch (e) {
      console.log('error', e);
    }
  }

  async getBlob(video: VideoCapture) {
    const contents = await Filesystem.readFile({ path: video.localURL });
    return this.b64toBlob(contents.data, video.type ?? 'video/quicktime');
  }

  b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
