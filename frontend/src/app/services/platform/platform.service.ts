import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private _platform: Platform) {
  }

  get isMobile(): boolean {
    return this._platform.is('capacitor') || this._platform.is('cordova');
  }

  get isWeb(): boolean {
    return !this.isMobile;
  }

  get isAndroid(): boolean {
    return this._platform.is('android');
  }
}
