import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../plugins/canvasjs.min';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  isIos = !this.platform.isAndroid;

  constructor(private platform: PlatformService) {
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnInit() {
  }

  initChart() {
    const chart = new CanvasJS.Chart('chartContainer', {
      backgroundColor: this.isDarkMode ? this.isIos ? '#000000' : '#121212' : '#ffffff',
      theme: this.isDarkMode ? 'dark1' : 'light2', // "light1", "light2", "dark1", "dark2"
      animationEnabled: true,
      zoomEnabled: true,
      toolTip: {
        enabled: false
      },
      axisX: {
        interval: 1,
        intervalType: 'month',
        valueFormatString: 'MMM',
        gridThickness: 0
      },
      axisY: {
        lineThickness: 0,
        gridThickness: 0,
        tickLength: 0,
        labelFormatter: () => ''
      },
      data: [
        {
          type: 'line',
          markerSize: 12,
          dataPoints: [
            { x: new Date(2016, 0o0, 1), y: 61, markerType: 'none' },
            { x: new Date(2016, 0o1, 1), y: -71, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o2, 1), y: 55, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o3, 1), y: -50, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o4, 1), y: 65, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o5, 1), y: -85, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o6, 1), y: 68, markerType: 'circle', markerColor: '#e2001a' },
            { x: new Date(2016, 0o7, 1), y: -28, markerType: 'circle', markerColor: '#e2001a' }
          ]
        }
        // todo: plot second data set with points
      ]
    });

    chart.render();
  }

}
