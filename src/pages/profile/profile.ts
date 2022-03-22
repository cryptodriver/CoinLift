import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public data: any = { name: '', self_pr: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider, private storage: Storage, public events:Events) {
  }

  ionViewWillEnter() {
    this.storage.get('my').then((obj) => {
      this.data = obj;
    });
  }

  doRedirect(k, v?) {
    this.navCtrl.push('EditPage', {k: k, v});
  }

  doSignout() {
    this.storage.get('my').then((obj) => {
      this.api.signout(obj).then((res: any) => {
        if (res.err) {
          this.events.publish('app:action', 'alert', { title: '', subTitle: 'サインアウトに失敗しました。<br>しばらくしてもう一度お試しください' });
        } else {
          this.events.publish('user:action', 'signout');
          this.navCtrl.pop();
        }
      });
    });
  }

}
