import { Component, OnInit } from '@angular/core';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mediaCapture: MediaCapture) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    // const options: CaptureImageOptions = { limit: 3 };
    // this.mediaCapture.captureImage(options)
    // .then(
    //   (data: MediaFile[]) => console.log(data),
    //   (err: CaptureError) => console.error(err)
    // );

    try {
      const video = await this.mediaCapture.captureVideo();
      console.log('VIDEO', video)
    } catch (e) {
      console.log('ERROR', e)
    }

  }
}
