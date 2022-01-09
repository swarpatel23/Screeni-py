import { Component, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'ScreeniPy';

  tickerOptions: any[] = [];
  selectedTickerOption: any | undefined;

  screeningOptions: any[] = [];
  selectedScreeningOption: any | undefined;

  lowestVolumeDays: number = 0;

  minRSI: number = 0;
  maxRSI: number = 100;

  reversalOptions: any[] = [];
  selectedReversalOption: any | undefined;
  MALength: number = 0;

  chartPatternOptions: any[] = [];
  selectedChartPatternOption: any | undefined;

  lookBackBars: number = 1;

  stockData: any[] = [];

  loading: boolean = false;
  @ViewChild('dt') dt: Table | undefined;


  constructor(private zone: NgZone) {
    this.tickerOptions = [
      { name: 'All Stocks (NSE)', value: '12' },
      { name: 'Nifty 50', value: '1' },
      { name: 'Nifty Next 50', value: '2' },
      { name: 'Nifty 100', value: '3' },
      { name: 'Nifty 200', value: '4' },
      { name: 'Nifty 500', value: '5' },
      { name: 'Nifty Smallcap 50', value: '6' },
      { name: 'Nifty Smallcap 100', value: '7' },
      { name: 'Nifty Smallcap 250', value: '8' },
      { name: 'Nifty Midcap 50', value: '9' },
      { name: 'Nifty Midcap 100', value: '10' },
      { name: 'Nifty Midcap 150', value: '11' },
    ];

    this.screeningOptions = [
      { name: 'Full Screening', value: '0' },
      { name: 'Breakout or Consolidation', value: '1' },
      { name: 'Recent Breakout & Volume', value: '2' },
      { name: 'Consolidating', value: '3' },
      { name: 'Lowest Volume in last N-days', value: '4' },
      { name: 'RSI', value: '5' },
      { name: 'Reversal Signals', value: '6' },
      { name: 'Making Chart Patterns', value: '7' },
    ];

    this.selectedScreeningOption = this.screeningOptions[0];

    this.reversalOptions = [
      { name: 'Buy Signal (Bullish Reversal)', value: '1' },
      { name: 'Sell Signal (Bearish Reversal)', value: '2' },
      { name: 'Momentum Gainers (Rising Bullish Momentum)', value: '3' },
      { name: 'Reversal at Moving Average (Bullish Reversal)', value: '4' },
    ];

    this.selectedReversalOption = this.reversalOptions[0];

    this.chartPatternOptions = [
      { name: 'Bullish Inside Bar(Flag) Pattern', value: '1' },
      { name: 'Bearish Inside Bar(Flag) Pattern', value: '2' },
      { name: 'IPO Base Breakout Pattern', value: '3' },
      { name: 'Confluence(50 & 200 MA / EMA)', value: '4' },
    ];

    this.selectedChartPatternOption = this.chartPatternOptions[0];
  }

  ngOnInit() {
  }

  screenStocks() {
    this.stockData = [];
    this.loading = true;

    var source = new EventSource(this.prepareScreeningUrl());
    console.log(source);
    source.onmessage = (event) => {
      this.loading = false;
      // append stocks to the list
      this.zone.run(() => {
        this.stockData.push(JSON.parse(event.data));
      })
    }

    source.onerror = (event) => {
      source.close();
    }
  }

  prepareScreeningUrl() {
    var url: string = 'http://localhost:8081/api/screen';
    url += '?ticker=' + this.selectedTickerOption.value;
    url += '&screening=' + this.selectedScreeningOption.value;
    if (this.selectedScreeningOption.value == '4') {
      url += '&lowestVolumeDays=' + this.lowestVolumeDays;
    }
    if (this.selectedScreeningOption.value == '5') {
      url += '&minRSI=' + this.minRSI;
      url += '&maxRSI=' + this.maxRSI;
    }
    if (this.selectedScreeningOption.value == '6') {
      url += '&reversal=' + this.selectedReversalOption.value;
      url += '&MALength=' + this.MALength;
    }
    if (this.selectedScreeningOption.value == '7') {
      url += '&chartPattern=' + this.selectedChartPatternOption.value;
      url += '&lookBackBars=' + this.lookBackBars;
    }
    return url;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

}