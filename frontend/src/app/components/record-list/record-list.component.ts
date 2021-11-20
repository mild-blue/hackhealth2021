import { Component, Input, OnInit } from '@angular/core';
import { Record } from '../../model/Record';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss'],
})
export class RecordListComponent implements OnInit {

  @Input() records: Record[] = [];

  constructor() { }

  ngOnInit() {}

}
