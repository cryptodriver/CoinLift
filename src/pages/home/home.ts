import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import datalabels from 'chartjs-plugin-datalabels';
// import { LongPressModule } from 'ionic-long-press';

import { ApiProvider } from '../../providers/api/api';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('canvas') canvas;

  public chart: any;
  public data: any = { h: [ [0, 0, 0, ''], [0, 0, 0, ''], [0, 0, 0, ''] ], c: [0, 0, 0], l: [] };
  public mdiv: string = '1';
  public favs: any = [ ];
  public vlas: any = [ ];
  public show: boolean = false;

  // get from personal setting
  public config: any = { c: 'USD', i: 60000, n: ['BTC', 'ETH', 'BCH'] };

  constructor(public navCtrl: NavController, public api: ApiProvider) {
    Chart.plugins.register(datalabels);
  }

  ionViewDidLoad() {
    this.initChart();
    // Observable.interval(this.config.i).startWith(0).subscribe(() => {
    Observable.interval(this.config.i).subscribe(() => {
      this.doMarket().then(() => {
        this.doChart();
      });

      for(let o of this.vlas) {
        this.api.getTicker({ id: o[0], currency: this.config.c }).then((res: any) => {
          this.vlas[this.vlas.findIndex(v => v[0] === o[0])][2] = res.data.quotes[this.config.c].price;
          this.vlas[this.vlas.findIndex(v => v[0] === o[0])][3] = res.data.quotes[this.config.c].percent_change_24h
        });
      }
    });
  }

  ionViewWillEnter() {
    this.api.getStorage('my').then((obj: any) => {
      if (obj) {
        this.config.c = obj.currency;
        this.config.n = obj.coins;
      }
      this.doMarket().then(() => {
        this.doChart();
      });
    });

    this.api.getStorage('favs').then((obj: any) => {
      if(obj) {
        this.favs = obj;
        this.vlas = [];
        for(let o of obj) {
          this.api.getTicker({ id: o.id, currency: this.config.c }).then((res: any) => {
            if (this.vlas.findIndex(v => v[0] === o.id) < 0 ) {
              this.vlas.push([ o.id, o.symbol, res.data.quotes[this.config.c].price, res.data.quotes[this.config.c].percent_change_24h ]);
            }
          }).then(() => {
            this.vlas.sort(function(a, b) {
              return a[1] > b[1];
            });
          });
        }
      }
    });

  }

  doMarket() {
    return this.api.getCoins(1, 100, 'JPY').then((res: any) => {
      let c1 = 0; let idx = 0;
      res.data.forEach((o, i) => {
        if ( this.config.n.indexOf(o.symbol) > -1 ) {
          let t = [Math.round(o.quotes[this.config.c].price*100)/100, o.quotes[this.config.c].percent_change_1h];
          if ( ['JPY', 'CNY'].indexOf(this.config.c) > -1 ) {
            t.push(Math.round(o.quotes['USD'].price*100)/100);
          } else {
            t.push(Math.round(o.quotes['JPY'].price*100)/100);
          }
          t.push(o.symbol);
          this.data.h[idx++] = t;
        }
        if ( ['BTC'].indexOf(o.symbol) > -1 ) {
          this.data.c[0] = o.quotes[this.config.c].market_cap;
        }
        c1 += o.quotes[this.config.c].market_cap;
        this.data.l[i] = [o.symbol, o.quotes[this.config.c].price, o.quotes[this.config.c].percent_change_1h, o.quotes[this.config.c].percent_change_24h];
      });
      this.data.c[1] = c1;
    }).then(obj => {
      return this.api.getGlobal(this.config.c).then((res: any) => {
        this.data.c[2] = Math.round(res.data.quotes[this.config.c].total_market_cap);
      });
    });
  }

  initChart() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: [""],
        datasets: [
          { label: "Bitcoin", data: [33.33], backgroundColor: ['rgba(128, 0, 0, 1)'], borderWidth: 0 },
          { label: "Top2~100", data: [33.33], backgroundColor: ['rgba(0, 128, 128, 1)'], borderWidth: 0 },
          { label: "Others", data: [33.33], backgroundColor: ['rgba(128, 0, 128, 1)'], borderWidth: 0 }
        ]
      },
      options: {
        legend: {
          display: true,
        },
        tooltips: {
          enabled: false,
        },
        animation:{
          duration: 0,
        },
        plugins: {
          datalabels: {
            color: 'white',
            formatter: function(value, context) {
              return value+'%';
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display:false,
              drawBorder: false
            },
            ticks: {
              display: false,
              max: 100
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              display:false,
              drawBorder: false
            },
            ticks: {
              display: false,
            }
          }]
        }
      }
    });
  }

  doChart() {
    this.chart.data.datasets[0].data = [Math.round(this.data.c[0]/this.data.c[2]*100*100)/100];
    this.chart.data.datasets[1].data = [Math.round((this.data.c[1]-this.data.c[0])/this.data.c[2]*100*100)/100];
    this.chart.data.datasets[2].data = [Math.round((this.data.c[2]-this.data.c[1])/this.data.c[2]*100*100)/100];
    this.chart.update();
  }

  doRefresh(e) {
    setTimeout(() => {
      this.doMarket().then(() => {
        this.doChart();
      });
      e.complete();
    }, 1000);
  }

  doAction(k, v?, e?) {
    switch(k) {
      case 1:
        this.navCtrl.push('CoinPage');
        break;
      case 2:
        this.api.getStorage('favs').then((obj: any) => {
          if (this.favs.splice(this.favs.findIndex(o => o.id === v[0]), 1)) {
            this.api.initStorage('favs', this.favs);
            this.vlas.splice(this.vlas.findIndex(o => o[0] === v[0]), 1);
          }
          if (this.favs.length == 0) {
            this.show = false;
          }
        });
        break;
      case 3:
        if (this.vlas.length > 0) {
          this.show = !this.show;
        }
        break;
      default:
        break;
    }
  }

}
