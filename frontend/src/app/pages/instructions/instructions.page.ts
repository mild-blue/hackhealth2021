import { Component, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss']
})
export class InstructionsPage implements OnInit {

  public isMobile = this.platformService.isMobile;
  step: 1 | 2 = 1;
  length: 30 | 60 = 30;

  constructor(private platformService: PlatformService) {
  }

  ngOnInit() {
  }

}
