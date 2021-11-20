import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePatientSuccessPageRoutingModule } from './invite-patient-success-routing.module';

import { InvitePatientSuccessPage } from './invite-patient-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitePatientSuccessPageRoutingModule
  ],
  declarations: [InvitePatientSuccessPage]
})
export class InvitePatientSuccessPageModule {}
