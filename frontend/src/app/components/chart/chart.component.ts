import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class ChartComponent implements OnChanges {

  @Input() record?: RecordDetail;

  isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  isIos = this.platform.isIos;

  constructor(private platform: PlatformService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.record && this.record) {
      const dataPoints = this.transformChartData(this.record);
      const distPoints = this.getPeaksDistancesChartData(this.record);
      this.initChart('heartRateChart', dataPoints);
      this.initChart('peakDistancesChart', distPoints);
    }
  }

  getPeaksDistancesChartData(record: RecordDetail) {
    const dataPoints: DataPoint[] = [];
    // eslint-disable-next-line guard-for-in
    for (const x in record.peaks_distances) {
      dataPoints.push({
        x: Number(x),
        y: record.peaks_distances[x],
        markerType: 'none',
        markerColor: defaultMarkerColor
      });
    }

    return dataPoints;
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

    return dataPoints;
  }

  initChart(containerId: string, dataPoints: DataPoint[]) {
    const chart = new CanvasJS.Chart(containerId, {
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
        gridThickness: 0,
        labelFormatter: () => ''
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
          markerSize: 4,
          dataPoints
        }
      ]
    });

    chart.render();
  }

}
