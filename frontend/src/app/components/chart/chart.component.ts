import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../../plugins/canvasjs.min';
import { PlatformService } from '../../services/platform/platform.service';
import { RecordDetail } from '../../model/RecordDetail';

interface DataPoint {
  x: number,
  y: number,
  markerType: string,
  markerColor: string
}

const defaultMarkerColor = '#e2001a';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() record?: RecordDetail;

  isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  isIos = !this.platform.isAndroid;

  constructor(private platform: PlatformService) {
  }

  ngAfterViewInit() {
    if (!this.record) {
      return;
    }


  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.record && this.record) {
      const dataPoints = this.transformChartData(this.record);
      this.initChart(dataPoints);
    }
  }

  transformChartData(record: RecordDetail) {
    const dataPoints: DataPoint[] = [];
    const xs = record.pulse_wave[0];
    const ys = record.pulse_wave[1];
    const peaksXs = record.peaks[0];
    const peaksYs = record.peaks[1];
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      const y = ys[i];

      let markerType = 'none';
      const xPeakIndex = peaksXs.indexOf(x);
      if (xPeakIndex !== -1 && peaksYs.includes(y)) {
        markerType = 'circle';
      }

      dataPoints.push({ x, y, markerType, markerColor: defaultMarkerColor });
    }

    console.log('dataPoints', dataPoints);
    return dataPoints;
  }

  initChart(dataPoints: DataPoint[]) {
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
          dataPoints
        }
        // todo: plot second data set with points
      ]
    });

    chart.render();
  }

}
