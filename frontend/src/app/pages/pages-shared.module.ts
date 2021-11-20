import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../components/loading/loading.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecordListComponent } from '../components/record-list/record-list.component';
import { ChartComponent } from '../components/chart/chart.component';
import { CardComponent } from '../components/card/card.component';

@NgModule({
  declarations: [
    LoadingComponent,
    RecordListComponent,
    ChartComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    LoadingComponent,
    RecordListComponent,
    ChartComponent,
    CardComponent
  ]
})
export class PagesSharedModule {
}
