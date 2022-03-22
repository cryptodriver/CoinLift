import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  public data: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public api: ApiProvider) {

  }

  ionViewDidLoad() {
    //
  }

  ionViewWillEnter() {
    this.api.listNews().then((res: any) => {
      this.data = res;
      if (res) {
        this.api.global.news_count = 0;
      }
    });
  }

  doRefresh(e) {
    setTimeout(() => {
      this.api.listNews().then((res: any) => {
        this.data = res;
        if (res) {
          this.api.global.news_count = 0;
        }
      });
      e.complete();
    }, 500);
  }

  doInfinite(e) {
    setTimeout(() => {
      let last = this.data[this.data.length-1].created_at;
      this.api.listNews(last).then((res: any) => {
        if (res) {
          this.data = this.data.concat(res);
          this.api.global.news_count = 0;
        }
      });
      e.complete();
    }, 500);
  }

  doAction(k, v?: any) {
    switch(k) {
      case 1:
        this.api.reviewNews({ id: v.id, attrs: { good: v['_good']?-1:1 } }).then((res: any) => {
          v['_good'] ? v.good = v.good - 1 : v.good = v.good + 1;
          v['_good'] = !v['_good'];
        });
        break;
      case 2:
        this.api.reviewNews({ id: v.id, attrs: { bad: v['_bad']?-1:1 } }).then((res: any) => {
          v['_bad'] ? v.bad = v.bad - 1 : v.bad = v.bad + 1;
          v['_bad'] = !v['_bad'];
        });
        break;
      case 3:
        this.modalCtrl.create('SharePage', v, {
          cssClass: 'center-modal',
        }).present();
        break;
      case 4:
        break;
      default:
        break;
    }
  }

  doClamp(o: any) {
    o['_clamped'] = !o['_clamped'];
  }

}
