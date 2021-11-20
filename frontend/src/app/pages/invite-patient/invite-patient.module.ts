import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePatientPageRoutingModule } from './invite-patient-routing.module';

import { InvitePatientPage } from './invite-patient.page';
import { PagesSharedModule } from '../pages-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitePatientPageRoutingModule,
    PagesSharedModule
  ],
  declarations: [InvitePatientPage]
})
export class InvitePatientPageModule {}
