import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeasureButtonPageRoutingModule } from './measure-button-routing.module';

import { MeasureButtonPage } from './measure-button.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeasureButtonPageRoutingModule
  ],
  declarations: [MeasureButtonPage]
})
export class MeasureButtonPageModule {}
