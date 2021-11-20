import { Component, OnInit } from '@angular/core';
import { CaptureError, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { Filesystem } from '@capacitor/filesystem';
import { ApiService } from '../../services/api/api.service';
import { AlertController, NavController } from '@ionic/angular';
import { PlatformService } from '../../services/platform/platform.service';

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

  public isWeb = this.platformService.isWeb;
  public loading = false;
  public isWaiting = true;
  public errorMessage = '';
  public recordId?: string;

  constructor(private mediaCapture: MediaCapture,
              private api: ApiService,
              private alertController: AlertController,
              private platformService: PlatformService,
              private navController: NavController) {
  }

  ngOnInit() {
    if (this.isWeb) {
      return;
    }
    this.init();
  }

  async init() {
    const alert = await this.alertController.create({
      message: `<h3>Please turn on your flashlight</h3>`,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.perform();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.navController.navigateBack('/patient');
          }
        }
      ]
    });

    return alert.present();
  }

  async perform() {
    this.isWaiting = true;
    this.errorMessage = '';
    this.recordId = '';

    const video = await this.captureVideo();
    const blob = await this.getBlob(video);

    if (!blob) {
      this.errorMessage = 'Could not process video';
      return;
    }

    this.isWaiting = false;
    this.loading = true;
    try {
      this.recordId = await this.api.uploadVideo(blob);
    } catch (e) {
      this.errorMessage = e.message;
    } finally {
      this.loading = false;
    }
  }

  async captureVideo(): Promise<VideoCapture> {
    try {
      const result: MediaFile[] | CaptureError = await this.mediaCapture.captureVideo({ duration: 60 });
      if ('code' in result) {
        return;
      }

      const file = (result as MediaFile[])[0];
      console.log('==== RECORDED FILE', file);
      const video = file as unknown as VideoCapture;
      console.log('==== RECORDED VIDEO', video);
      console.log('==== VIDEO localURL', video.localURL, '==== VIDEO FULL PATH', video.fullPath);
      return video;
    } catch (e) {
      console.log('==== ERROR WHILE RECORDING VIDEO', e);
    }
  }

  async getBlob(video: VideoCapture) {
    const path = this.platformService.isAndroid ? video.fullPath : video.localURL;
    console.log('==== READING FROM', path);
    const permissions = await Filesystem.requestPermissions();
    console.log('====  Filesystem.requestPermissions()', permissions.publicStorage);
    if (permissions.publicStorage !== 'denied') {
      const contents = await Filesystem.readFile({ path });
      return this.b64toBlob(contents.data, video.type ?? 'video/quicktime');
    }
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
