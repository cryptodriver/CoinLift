import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, ModalController, Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-board',
  templateUrl: 'board.html',
})
export class BoardPage {

  public target: string = '0';
  public data: any;
  public relation: any = { follows:[], blocks: [] };

  constructor(public navCtrl: NavController, public popCtrl: PopoverController,
    public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider,
    public events: Events) {
  }

  ionViewDidLoad() {
    this.api.getStorage('my').then((obj: any) => {
      this.api.listRelation({ token: obj.token}).then((res: any) => {
        if (res) {
          this.relation = res;
        }
      });
    });
  }

  doChange() {
    this.api.getStorage('my').then((obj: any) => {
      this.api.listPosts({
        token: obj.token,
        last: '2099-12-31 00:00:00',
        target: this.target,
        limit: 10
      }).then((res: any) => {
        this.data = res;
      });
    });
  }

  ionViewWillEnter() {
    this.api.listPosts({
      token: null,
      last: '2099-12-31 00:00:00',
      target: this.target,
      limit: 10
    }).then((res: any) => {
      this.data = res;
    });
  }

  doRefresh(e) {
    setTimeout(() => {
      this.api.getStorage('my').then((obj: any) => {
        this.api.listPosts({
          token: obj.token,
          last: '2099-12-31 00:00:00',
          target: this.target,
          limit: 10
        }).then((res: any) => {
          this.data = res;
        });
      });
      e.complete();
    }, 1000);
  }

  doInfinite(e) {
    setTimeout(() => {
      this.api.getStorage('my').then((obj: any) => {
        this.api.listPosts({
          token: obj.token,
          last: this.data[this.data.length-1].created_at,
          target: this.target,
          limit: 10
        }).then((res: any) => {
          if (res) {
            this.data = this.data.concat(res);
          }
        });
      });
      e.complete();
    }, 1000);
  }

  doAction(k, v?: any, e?) {
    this.api.getStorage('my').then((obj: any) => {
      if (!obj.token && [5].indexOf(k) < 0) {
        this.events.publish('app:action', 'alert', { title: '', subTitle: 'この操作はサインインが必要です' });
        return;
      }

      switch(k) {
        case 0:
          this.navCtrl.push('PostPage', {  });
          break;
        case 1:
          this.api.reviewPost({ id: v.id, token: obj.token, attrs: { like: v['_like']?-1:1 } }).then((res: any) => {
            v['_like'] ? v.like = v.like - 1 : v.like = v.like + 1;
            v['_like'] = !v['_like'];
          });
          break;
        case 3:
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
        case 2:
          this.api.relationFollow({ token: obj.token, attrs: {
            follow: this.relation.follows.includes(v.user_id) ? '-' : '+', user_id: v.user_id }
          }).then((res: any) => {
            if (this.relation.follows.includes(v.user_id)) {
              this.relation.follows.splice(this.relation.follows.indexOf(v.user_id), 1);
            } else {
              this.relation.follows.push(v.user_id);
            }
          });
          break;
        case 4:
          let p = this.popCtrl.create('RelationPage',{ id: v.id , user_id: v.user_id, my_id: obj.id , relation: this.relation }, { cssClass: 'half-popover' });
          p.onDidDismiss(id => {
            if (id) {
              this.data.splice(this.data.findIndex(d => d.id === id), 1);
            }
          });
          p.present({ev: e});
          break;
        case 5:
          v['my_id'] = obj.id;
          this.navCtrl.push('DetailPage', v);
          break;
        case 6:
          this.modalCtrl.create('ViewPage', v, {
            cssClass: 'center-modal',
          }).present();
          break;
        case 7:
          if (v.comment.user_id == obj.id) {
            this.api.deleteComment({ token: obj.token, id: v.comment.id }).then((res: any) => {
              v.post.comment.splice(v.post.comment.findIndex(d => d.id === v.comment.id), 1);
            });
          }
          break;
        case 8:
          this.navCtrl.push('CoverPage', v.user_id);
          break;
        default:
          break;
      }
    });
  }

}
