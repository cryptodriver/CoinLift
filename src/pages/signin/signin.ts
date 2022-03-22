import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  @ViewChild('input') input ;

  public form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,
    public api: ApiProvider, private frmBuilder: FormBuilder, private events: Events) {
    this.form = this.frmBuilder.group({
      email: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.minLength(4), Validators.required ])
    });
  }

  ionViewDidLoad() {
  }

  ngAfterViewChecked() {
    // this.input.setFocus();
  }

  doSignin() {
    this.api.signin({email: this.form.value['email'], password: this.form.value['password']}).then((res1: any) => {
      if (res1.err) {
        this.events.publish('app:action', 'alert', { title: '', subTitle: 'サインインに失敗しました。<br>メールアドレスやパスワードをご確認ください' });
      } else {
        this.api.referProfile({ token: res1.token }).then((res2: any) => {
          this.events.publish('user:action', 'signin', { id: res1.id, token: res1.token,
            avatar: res2?res2.avatar:'assets/imgs/avatar.png', name: res2?res2.name:'', self_pr: res2?res2.self_pr:'' });
          this.viewCtrl.dismiss();
        });
      }
    });
  }

  doRegister() {
    this.navCtrl.push('RegisterPage');
  }

  doClose() {
    this.viewCtrl.dismiss();
  }

}
