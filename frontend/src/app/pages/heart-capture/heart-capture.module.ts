import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeartCapturePageRoutingModule } from './heart-capture-routing.module';

import { HeartCapturePage } from './heart-capture.page';
import { PagesSharedModule } from '../pages-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeartCapturePageRoutingModule,
    PagesSharedModule
  ],
  declarations: [HeartCapturePage]
})
export class HeartCapturePageModule {}
