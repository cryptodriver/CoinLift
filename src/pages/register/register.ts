import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private type: string = 'password';
  private wait: number = 0;

  private data: any = { email: '', password: '', codes: [] };

  public form: FormGroup;

  @ViewChild('input') input ;

  constructor(public navCtrl: NavController,  public viewCtrl: ViewController,
    public navParams: NavParams, public api: ApiProvider, private frmBuilder: FormBuilder, private events: Events) {
    this.form = this.frmBuilder.group({
      email: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.minLength(4), Validators.maxLength(20), Validators.required ]),
      code: new FormControl('', [ Validators.minLength(4), Validators.maxLength(6), Validators.required ])
    });
  }

  ionViewDidLoad() {
  }

  doClose() {
    this.viewCtrl.dismiss();
  }

  doAction(k, v?) {
    switch(k) {
      case 1:
        if (this.type == 'password') {
          this.type = 'text';
        } else {
          this.type = 'password';
        }
        break;
      case 2:
        this.api.vertify({ email: this.form.value['email'] }).then((res: any) => {
          this.events.publish('app:action', 'alert', { title: '', subTitle: '検証コードを入力されたメール宛に送信しました。' });
          this.data.codes.push(res.code);
          this.wait = 59;
          this.startTimer();
        });
        break;
      case 3:
        if (this.data.codes.indexOf(this.form.value['code']) < 0 ) {
          this.events.publish('app:action', 'alert', { title: '', subTitle: '検証コードは正しくありません。' });
        } else {
          this.api.signup({ email: this.form.value['email'], password: this.form.value['password'] }).then((res: any) => {
            if(res.err) {
              this.events.publish('app:action', 'alert', { title: '', subTitle: 'アカウント登録に失敗しました。<br>しばらくして試すかメールアドレスを変えてもう一度お試しください' });
            } else {
              this.events.publish('app:action', 'toast', { message: '登録完了しました。サインインしてください。' });
              this.viewCtrl.dismiss({ email: this.form.value['email'], password: this.form.value['password'] });
            }
          });
        }
        break;
      default:
        break;
    }
  }

  startTimer() {
    setTimeout(x => {
      this.wait -= 1;
      if (this.wait > 0 ){
        this.startTimer();
      }
    }, 1000);
  }

}
