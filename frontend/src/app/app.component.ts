import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // HACK: Timeout for preventing white screen after SplashScreen.hide()
      setTimeout(SplashScreen.hide, 500);
    });
  }
}
