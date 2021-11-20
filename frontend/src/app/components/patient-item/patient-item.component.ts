import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../../model/Patient';

@Component({
  selector: 'app-patient-item',
  templateUrl: './patient-item.component.html',
  styleUrls: ['./patient-item.component.scss'],
})
export class PatientItemComponent implements OnInit {

  @Input() patient?: Patient;
  @Input() selected?: boolean;

  constructor() { }

  ngOnInit() {}

}
