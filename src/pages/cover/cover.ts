import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, ModalController, Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-cover',
  templateUrl: 'cover.html',
})
export class CoverPage {

    public data: any = { cover: {}, posts: [], myid: 0 };
    public id: number;
    public relation: any = { follows:[], blocks: [] };

    constructor(public navCtrl: NavController, public popCtrl: PopoverController,
      public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider,
      public events: Events) {
      this.id = this.navParams.data;
    }

    ionViewDidLoad() {
      this.api.getStorage('my').then((obj: any) => {
        this.api.listRelation({ token: obj.token}).then((res: any) => {
          if (res) {
            this.relation = res;
          }
        });
        this.data.myid = obj.id;
      });
    }

    ionViewWillEnter() {
      this.api.getStorage('my').then((obj: any) => {
        this.api.usersCover({
          user_id: this.id,
          token: obj.token
        }).then((res: any) => {
          this.data.cover = res;
        });

        this.api.usersPost({
          user_id: this.id,
          last: '2099-12-31 00:00:00',
          limit: 10
        }).then((res: any) => {
          this.data.posts = res;
        });
      });
    }

    doRefresh(e) {
      setTimeout(() => {
        this.api.getStorage('my').then((obj: any) => {
          this.api.usersPost({
            user_id: this.id,
            last: '2099-12-31 00:00:00',
            limit: 10
          }).then((res: any) => {
            this.data.posts = res;
          });
        });
        e.complete();
      }, 1000);
    }

    doInfinite(e) {
      setTimeout(() => {
        this.api.getStorage('my').then((obj: any) => {
          this.api.usersPost({
            user_id: this.id,
            last: this.data.posts[this.data.length-1].created_at,
            limit: 10
          }).then((res: any) => {
            if (res) {
              this.data.posts = this.data.posts.concat(res);
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
            break;
          case 4:
            let p = this.popCtrl.create('RelationPage',{ id: v.id , user_id: v.user_id, my_id: obj.id , relation: this.relation }, { cssClass: 'half-popover' });
            p.onDidDismiss(id => {
              if (id) {
                this.data.posts.splice(this.data.posts.findIndex(d => d.id === id), 1);
              }
            });
            p.present({ev: e});
            break;
          case 5:
            v['my_id'] = obj.id;
            this.navCtrl.push('DetailPage', v);
            break;
          case 6:
            break;
          case 7:
            if (v.comment.user_id == obj.id) {
              this.api.deleteComment({ token: obj.token, id: v.comment.id }).then((res: any) => {
                v.post.comment.splice(v.post.comment.findIndex(d => d.id === v.comment.id), 1);
              });
            }
            break;
          case 8:
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
          default:
            break;
        }
      });
    }

  }
