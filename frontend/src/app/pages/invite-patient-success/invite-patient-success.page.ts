import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformService } from '../../services/platform/platform.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-invite-patient-success',
  templateUrl: './invite-patient-success.page.html',
  styleUrls: ['./invite-patient-success.page.scss']
})
export class InvitePatientSuccessPage implements OnInit {

  code?: string;
  name?: string;

  copiedSuccess = '';

  constructor(private activatedRoute: ActivatedRoute,
              private platformService: PlatformService) {
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code') ?? undefined;
    this.name = this.activatedRoute.snapshot.paramMap.get('name') ?? undefined;
  }

  async handleCopy() {
    if (!this.code) {
      return;
    }
    if (this.platformService.isWeb) {
      try {
        await window.navigator.clipboard.writeText(this.code);
        this.copiedSuccess = 'Copied!';
      } catch (e) {
        //ignore
      }
    } else if (this.platformService.isMobile) {
      await Clipboard.write({
        // eslint-disable-next-line id-blacklist
        string: this.code
      });
      this.copiedSuccess = 'Copied!';
    }

    setTimeout(() => this.copiedSuccess = '', 3000);
  }
}
