import { Component, OnInit } from '@angular/core';
import { CaptureError, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';

// import { Filesystem } from '@capacitor/filesystem';

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

const MEDIA_FOLDER_NAME = 'my_media';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mediaCapture: MediaCapture,
              private alertService: AlertController,
              private file: File,
              private sanitizer: DomSanitizer,
              private plt: Platform,
              private http: HttpClient,
              private webview: WebView) {
  }

  ngOnInit() {
    this.plt.ready().then(() => {
      const path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          console.log('Dir exists');
          this.init();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false).then(() => {
            this.init();
          });

        }
      );
    });


  }

  async init() {
    const alert = await this.alertService.create({
      message: `<h3>Please turn on your flashlight</h3>`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: value => {
            this.captureVideo();
          }
        }
      ]
    });

    return alert.present();
  }

  async captureVideo() {
    try {
      const result: MediaFile[] | CaptureError = await this.mediaCapture.captureVideo({ duration: 5 });
      if ('code' in result) {
        return;
      }

      const file = (result as MediaFile[])[0];
      const video = file as unknown as VideoCapture;
      console.log('video', video);

      const fileEntry: FileEntry = await this.copyFileToLocalDir(video.fullPath);
      console.log('fileEntry', fileEntry);

      const src = this.sanitizer.bypassSecurityTrustResourceUrl(fileEntry.nativeURL);
      console.log('src', src);

      // fileEntry.file(async (f) => {
      //   console.log(f);
      //   const ab = await f.arrayBuffer();
      //   console.log(ab);
      // });

      // const a = this.webview.convertFileSrc(fileEntry.nativeURL);
      // console.log(a);

      // const b = await this.uriToBase64(fileEntry.nativeURL);
      // const promise = this.file.readAsText(this.file.dataDirectory + MEDIA_FOLDER_NAME, fileEntry.name);
      // await promise.then(value => {
      //   console.log(value);
      // });
      const path = 'file:/' + video.fullPath.substring(0, video.fullPath.lastIndexOf('/'));
      console.log(path, video.name);
      this.file.readAsArrayBuffer(path, video.name).then(
        r => console.log(r),
        error => {
          console.log('error', error);
        }
      ).catch(e => console.log(e));

      // fetch(video.localURL).then(res => console.log(res)).catch(e => console.log(e));
      // fetch(fileEntry.nativeURL).then(res => console.log(res)).catch(e => console.log(e));
      // const data: Observable<Blob> = this.http.get<Blob>(a, { headers: { responseType: 'blob' } });
      // data.subscribe((response: Blob) => {
      //   console.log(response);
      // }, (error: HttpErrorResponse) => {
      //   console.log(error.error.text);
      // });

      // const contents = await Filesystem.readFile({
      //   path: fileEntry.nativeURL
      // });
      //
      // console.log('data:', contents);

      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   // binary data
      //   console.log(e.target.result);
      // };
      // reader.onerror = (e) => {
      //   // error occurred
      //   console.log('Error : ' + e.type);
      // };
      // reader.readAsBinaryString(file.fullPath);
    } catch (e) {
      console.log('ERROR', e);
    } finally {
    }
  }

  uriToBase64(uri) {
    let nameFile = uri.replace(this.file.dataDirectory, '');

    return this.file.readAsDataURL(this.file.dataDirectory, nameFile).then((file64) => {
      let base64String = ('' + file64 + '').replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
      console.log('data: ', base64String); // Receiving the base 64 correctly here
      return base64String;
    })
    .catch(err => {
      console.log('Error while transforming image to base64: ', err);
      return err;
    });
  }

  async copyFileToLocalDir(fullPath): Promise<FileEntry | undefined> {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;


    try {
      const fileEntry = await this.file.copyFile(copyFrom, name, copyTo, newName);

      return fileEntry as FileEntry;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
