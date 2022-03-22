import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-coin',
  templateUrl: 'coin.html',
})
export class CoinPage {

  public data: any = [ ];
  public favs: any = [ ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    this.api.getStorage('favs').then((obj: any) => {
      if(obj) {
        this.favs = obj;
      }
    });
  }

  initTickers() {
    return new Promise(resolve => {
      this.api.getStorage('ticker').then((obj: any) => {
        if(!obj) {
          this.api.getListings().then((res: any) => {
            this.api.initStorage('ticker', res.data);
            resolve(res.data);
          });
        } else {
          resolve(obj);
        }
      });
    });
  }

  doAction(k, v?, e?) {
    switch(k) {
      case 1:
        this.data = [];
        break;
      case 2:
        this.initTickers().then((obj: any) => {
          let val = e.target.value;
          if (val && val.trim() != '') {
            this.data = obj.filter((item) => {
              return (item.symbol.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
          }
        });
        break;
      case 3:
        if (!this.favs.some((item) => item.id == v.id)) {
          this.favs.push(v);
        }
        this.api.initStorage('favs', this.favs);
        break;
      default:
        break;
    }
  }

  inArray(a, b, c) {
    return a.some((o) => o[c] == b[c]);
  }
}
