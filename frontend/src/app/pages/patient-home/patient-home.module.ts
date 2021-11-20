import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientHomePageRoutingModule } from './patient-home-routing.module';

import { PatientHomePage } from './patient-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientHomePageRoutingModule
  ],
  declarations: [PatientHomePage]
})
export class PatientHomePageModule {}
