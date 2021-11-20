import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeasurementDetailPageRoutingModule } from './measurement-detail-routing.module';

import { MeasurementDetailPage } from './measurement-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeasurementDetailPageRoutingModule
  ],
  declarations: [MeasurementDetailPage]
})
export class MeasurementDetailPageModule {}
