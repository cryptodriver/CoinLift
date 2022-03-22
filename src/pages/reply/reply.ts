import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-reply',
  templateUrl: 'reply.html',
})
export class ReplyPage {

  public form: FormGroup;
  public data: any;

  @ViewChild('input') input ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private frmBuilder: FormBuilder, public api: ApiProvider) {
      this.data = this.navParams.data;
      this.form = this.frmBuilder.group({
        content: new FormControl('', [ Validators.required, Validators.maxLength(80)])
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReplyPage');
  }

  ngAfterViewChecked() {
    this.input.setFocus();
  }

  doSubmit() {
    this.api.getStorage('my').then((obj: any) => {
      this.api.replyPost({ token: obj.token, attrs: { post_id: this.data.id, content: this.form.value['content'] }}).then((res: any) => {
        this.viewCtrl.dismiss({ name: obj.name||'ID'+obj.id, content: this.form.value['content'],
          avatar: obj.avatar, id: res.id, user_id: obj.id});
      });
    });

  }

}
