import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invite-patient-success',
  templateUrl: './invite-patient-success.page.html',
  styleUrls: ['./invite-patient-success.page.scss']
})
export class InvitePatientSuccessPage implements OnInit {

  code?: string;
  name?: string;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code') ?? undefined;
    this.name = this.activatedRoute.snapshot.paramMap.get('name') ?? undefined;
  }

  handleCopy() {
    // todo
  }
}
