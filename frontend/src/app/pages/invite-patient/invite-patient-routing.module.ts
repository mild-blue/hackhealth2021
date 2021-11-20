import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitePatientPage } from './invite-patient.page';

const routes: Routes = [
  {
    path: '',
    component: InvitePatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitePatientPageRoutingModule {}
