import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EmailComposer } from '@ionic-native/email-composer';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  public p: any = { k: '', v: {n: ''} };
  public data: any = { notify: true, currency: 'USD', coins: [] };

  public coins: any = [ 'BTC', 'ETH', 'XRP', 'BCH', 'EOS', 'XLM', 'LTC', 'ADA', 'DASH', 'XMR', 'ETC', 'BNB', 'XEM', 'LSK', 'MONA' ].sort();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider, private iab: InAppBrowser, public emailComposer: EmailComposer,
    public events: Events, private uniqueDeviceID: UniqueDeviceID) {
    this.p = this.navParams.data;
    if (this.p.k == 4) {
      this.data.coins = this.p.v.v;
    }
  }

  ionViewWillEnter() {
    this.api.getStorage('my').then((obj) => {
      this.data = obj;
    });
  }

  doAction(k, v?, e?) {
    switch(k) {
      case 1:
        this.uniqueDeviceID.get().then((uuid: any) => {
          this.api.registerDevice({attrs: { uuid: uuid, notify: this.data.notify }}).then((res: any) => {
            this.api.setStorage('my.notify', this.data.notify);
          });
        });
        break;
      case 2:
        this.api.setStorage('my.currency', this.data.currency);
        break;
      case 8:
        this.iab.create(v);
        break;
      case 9:
        this.emailComposer.open({ to: v });
        break;
      case 4:
        if (this.data.coins.length == 3) {
          this.api.setStorage('my.coins', this.data.coins);
        } else {
          this.events.publish('app:action', 'toast', { message: '注目コインは３個に選択しないと設定できません' });
        }
        break;
      case 10:
        break;
      default:
        break;
    }
  }

}
