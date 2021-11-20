import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientDetailPageRoutingModule } from './patient-detail-routing.module';

import { PatientDetailPage } from './patient-detail.page';
import { PagesSharedModule } from '../pages-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientDetailPageRoutingModule,
    PagesSharedModule
  ],
  declarations: [PatientDetailPage]
})
export class PatientDetailPageModule {}
