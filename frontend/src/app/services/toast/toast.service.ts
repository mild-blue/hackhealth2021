import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastPosition = 'top' | 'bottom' | 'middle' | 'bottom-w-footer' | 'bottom-w-double-footer';
const defaultDuration = 2000;
const errorDuration = 4000; // show until toast is closed manually

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {
  }

  public async error(text: string, position?: ToastPosition, duration?: number): Promise<HTMLIonToastElement> {
    return this.show(text, position, 'danger', duration ?? errorDuration);
  }

  public async success(text: string, position?: ToastPosition, duration?: number): Promise<HTMLIonToastElement> {
    return this.show(text, position, 'success', duration);
  }

  private async show(text: string, pos?: ToastPosition, color?: string, duration?: number): Promise<HTMLIonToastElement> {
    const position = !pos || pos === 'bottom-w-footer' || pos === 'bottom-w-double-footer' ? 'bottom' : pos;
    let cssClass = 'ion-text-center';
    cssClass += pos === 'bottom-w-footer' ? ' footer-visible' : '';
    cssClass += pos === 'bottom-w-double-footer' ? ' double-footer-visible' : '';

    const toast = await this.toastController.create({
      message: text,
      duration: duration ?? defaultDuration,
      color: color ?? 'success',
      position,
      cssClass,
      buttons: [{
        side: 'end',
        role: 'close',
        icon: 'close'
      }]
    });

    toast.present();

    return toast;
  }
}
