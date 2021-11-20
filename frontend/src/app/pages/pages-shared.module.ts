import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../components/loading/loading.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecordListComponent } from '../components/record-list/record-list.component';

@NgModule({
  declarations: [
    LoadingComponent,
    RecordListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    LoadingComponent,
    RecordListComponent
  ]
})
export class PagesSharedModule {
}
