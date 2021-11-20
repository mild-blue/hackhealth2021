import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitePatientSuccessPage } from './invite-patient-success.page';

const routes: Routes = [
  {
    path: '',
    component: InvitePatientSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitePatientSuccessPageRoutingModule {}
