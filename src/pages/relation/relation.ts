import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-relation',
  templateUrl: 'relation.html',
})
export class RelationPage {

  public data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider, public viewCtrl: ViewController) {
    this.data = this.navParams.data;
  }

  ionViewDidLoad() {
  }

  doAction(k, v?){
    this.api.getStorage('my').then((obj: any) => {

      switch(k) {
        case 1:
          this.api.relationFollow({ token: obj.token, attrs: {
            follow: this.data.relation.follows.includes(this.data.user_id) ? '-' : '+', user_id: this.data.user_id }
          }).then((res: any) => {
            if (this.data.relation.follows.includes(this.data.user_id)) {
              this.data.relation.follows.splice(this.data.relation.follows.indexOf(this.data.user_id), 1);
            } else {
              this.data.relation.follows.push(this.data.user_id);
            }
            this.viewCtrl.dismiss();
          });
          break;
        case 2:
          this.api.relationBlock({ token: obj.token, attrs: {
            follow: this.data.relation.blocks.includes(this.data.user_id) ? '-' : '+', user_id: this.data.user_id }
          }).then((res: any) => {
            if (this.data.relation.blocks.includes(this.data.user_id)) {
              this.data.relation.blocks.splice(this.data.relation.blocks.indexOf(this.data.user_id), 1);
            } else {
              this.data.relation.blocks.push(this.data.user_id);
            }
            this.viewCtrl.dismiss();
          });
          break;
        case 3:
          this.api.deletePost({ token: obj.token, id: this.data.id }).then((res: any) => {
            this.viewCtrl.dismiss(this.data.id);
          });
          break;
        default:
          break;
      }

    });
  }

}
