import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as CanvasJS from '../../plugins/canvasjs.min';
import { PlatformService } from '../../services/platform/platform.service';
import { RecordDetail } from '../../model/RecordDetail';

interface DataPoint {
  x: number,
  y: number,
  markerType?: string,
  markerColor?: string
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
      this.initPulseWaveChart('heartRateChart', dataPoints);
      this.initDistancesChart('peakDistancesChart', distPoints);
    }
  }

  getPeaksDistancesChartData(record: RecordDetail) {
    const dataPoints: DataPoint[] = [];
    // eslint-disable-next-line guard-for-in
    for (const x in record.peaks_distances) {
      dataPoints.push({
        x: Number(x),
        y: record.peaks_distances[x]
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

  initPulseWaveChart(containerId: string, dataPoints: DataPoint[]) {
    const maxX = Math.max(...this.record.pulse_wave[0]);
    const maximum = maxX < 30 ? 30 : 60 - maxX > maxX - 30 ? 30 : 60;
    const chart = new CanvasJS.Chart(containerId, {
      backgroundColor: this.isDarkMode ? this.isIos ? '#000000' : '#121212' : '#ffffff',
      theme: this.isDarkMode ? 'dark1' : 'light2', // "light1", "light2", "dark1", "dark2"
      animationEnabled: true,
      zoomEnabled: true,
      toolTip: {
        enabled: false
      },
      axisX: {
        title: 'Seconds (s)',
        titleFontSize: 12,
        interval: 5,
        intervalType: 'number',
        minimum: 0,
        maximum,
        labelFontSize: 10,
        gridThickness: 0,
        lineThickness: 0.25 / 2,
        tickThickness: 0.25
      },
      axisY: {
        title: 'Amplitude (au)',
        titleFontSize: 10,
        labelFontSize: 12,
        labelFormatter: () => '',
        gridThickness: 0.25,
        lineThickness: 0.25,
        tickThickness: 0.25
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

  initDistancesChart(containerId: string, dataPoints: DataPoint[]) {
    const chart = new CanvasJS.Chart(containerId, {
      backgroundColor: this.isDarkMode ? this.isIos ? '#000000' : '#121212' : '#ffffff',
      theme: this.isDarkMode ? 'dark1' : 'light2', // "light1", "light2", "dark1", "dark2"
      animationEnabled: true,
      zoomEnabled: true,
      toolTip: {
        enabled: false
      },
      axisX: {
        title: 'Peak',
        titleFontSize: 12,
        interval: 5,
        labelFormatter: (e) => e.value + 1,
        intervalType: 'number',
        labelFontSize: 10,
        gridThickness: 0,
        lineThickness: 0.25 / 2,
        tickThickness: 0.25
      },
      axisY: {
        title: 'Time (s)',
        intervalType: 'number',
        minimum: 0,
        maximum: 1,
        titleFontSize: 10,
        labelFontSize: 12,
        gridThickness: 0.25,
        lineThickness: 0.25,
        tickThickness: 0.25
      },
      data: [
        {
          type: 'scatter',
          markerType: 'circle',
          markerSize: 4,
          markerColor: '#e2001a',
          dataPoints
        }
      ]
    });

    chart.render();
  }

}
