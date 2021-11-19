import { Component, OnInit } from '@angular/core';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@awesome-cordova-plugins/camera-preview/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mediaCapture: MediaCapture,
              private flashlight: Flashlight,
              private cameraPreview: CameraPreview) {
  }

  ngOnInit() {
    this.init2();
  }

  async init2() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 25,
      y: 25,
      width: window.screen.width - 50,
      height: window.screen.height - 50,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    };

    const opts = {
      cameraDirection: this.cameraPreview.CAMERA_DIRECTION.BACK,
      width: (window.screen.width / 2),
      height: (window.screen.height / 2),
      quality: 60,
      withFlash: true
    };

    // await this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.ON);
    // this.cameraPreview.startRecordVideo(opts).then(filePath => console.log(filePath));
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    };

    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      async (res) => {
        this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.TORCH);
        this.cameraPreview.startRecordVideo(opts);
        // todo: use if video recording doesnt work
        // const base64s = [];
        // for (let i = 1; i <= 300; i++) {
        //   const image = await this.cameraPreview.takeSnapshot(pictureOpts);
        //   base64s.push(image);
        // }


        console.log(res);
      },
      (err) => {
        console.log(err);
      });


  }

  async init() {
    // const options: CaptureImageOptions = { limit: 3 };
    // this.mediaCapture.captureImage(options)
    // .then(
    //   (data: MediaFile[]) => console.log(data),
    //   (err: CaptureError) => console.error(err)
    // );


    try {
      this.mediaCapture.captureVideo({ duration: 5 }).then(video => console.log('VIDEO', video));
      this.mediaCapture.onPendingCaptureResult().subscribe(result => {
        console.log('RESULT', result);
      });
      await this.flashlight.switchOn();
    } catch (e) {
      console.log('ERROR', e);
    } finally {

      this.flashlight.switchOff();
    }


  }
}
