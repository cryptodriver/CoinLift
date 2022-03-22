import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  private data: any;
  private myid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public api: ApiProvider, public events: Events) {
      this.data = this.navParams.data;
      this.myid = this.navParams.data.my_id;
  }

  ionViewDidLoad() {
    this.api.postDetail({
      id: this.data.id
    }).then((res: any) => {
      this.data = res;
    });
  }

  doAction(k, v?) {
    this.api.getStorage('my').then((obj: any) => {
      if (!obj.token) {
        this.events.publish('app:action', 'alert', { title: '', subTitle: 'この操作はサインインが必要です' });
        return;
      }

      switch(k) {
        case 1:
          this.api.reviewComment({ id: v.id, token: obj.token, attrs: { like: v['_like']?-1:1 } }).then((res: any) => {
            v['_like'] ? v.like = v.like - 1 : v.like = v.like + 1;
            v['_like'] = !v['_like'];
          });
          break;
        case 2:
          let m = this.modalCtrl.create('ReplyPage', v, {
            cssClass: 'half-modal',
          });
          m.onDidDismiss(data => {
            if (data) {
              v.comment.unshift(data);
            }
          });
          m.present();
          break;
        case 3:
          this.api.reviewPost({ id: v.id, token: obj.token, attrs: { like: v['_like']?-1:1 } }).then((res: any) => {
            v['_like'] ? v.like = v.like - 1 : v.like = v.like + 1;
            v['_like'] = !v['_like'];
          });
          break;
        case 4:
          this.api.deleteComment({ token: obj.token, id: v.id }).then((res: any) => {
            this.data.comment.splice(this.data.comment.findIndex(d => d.id === v.id), 1);
          });
        default:
          break;
      }
    });
  }

  doRefresh(e) {
    setTimeout(() => {
      this.api.postDetail({
        id: this.data.id
      }).then((res: any) => {
        this.data = res;
      });
      e.complete();
    }, 1000);
  }

}
