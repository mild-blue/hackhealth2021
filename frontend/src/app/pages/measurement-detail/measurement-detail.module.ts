import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeasurementDetailPageRoutingModule } from './measurement-detail-routing.module';

import { MeasurementDetailPage } from './measurement-detail.page';
import { PagesSharedModule } from '../pages-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeasurementDetailPageRoutingModule,
    PagesSharedModule
  ],
  declarations: [MeasurementDetailPage]
})
export class MeasurementDetailPageModule {}
