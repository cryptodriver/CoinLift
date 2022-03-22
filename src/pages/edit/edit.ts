import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  @ViewChild('input1') input1;
  @ViewChild('input2') input2;
  public form: FormGroup;

  public p: any = { k: '', v: {n: '', v: ''} };
  public data: any = { name: '', self_pr: '' }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider, private frmBuilder: FormBuilder) {
    this.p = this.navParams.data;

    let group = {};
    switch(this.p.k) {
      case 1:
        group = {name: new FormControl(this.p.v.v, [ Validators.required, Validators.maxLength(12) ])};
        break;
      case 2:
        group = {self_pr: new FormControl(this.p.v.v, [ Validators.required, Validators.maxLength(80) ])};
        break;
      default:
        break;
    }
    this.form = this.frmBuilder.group(group);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  ionViewWillEnter() {
    this.api.getStorage('my').then((obj) => {
      this.data = obj;
    });
  }

  ngAfterViewChecked() {
    switch(this.p.k) {
      case 1:
        this.input1.setFocus();
        break;
      case 2:
        this.input2.setFocus();
        break;
      default:
        break;
    }
  }

  doSave(k, v?) {
    this.api.getStorage('my').then((obj: any) => {
      if (obj) {
        var t: any = { token: obj.token, attrs: {} };
        switch(k) {
          case 1:
            t['attrs']['name'] = this.form.value['name'];
            break;
          case 2:
            t['attrs']['self_pr'] = this.form.value['self_pr'];
            break;
          default:
            break;
        }

        this.api.changeProfile(t).then((res: any) => {
          switch(k) {
            case 1:
              this.p.v.v = t.attrs.name;
              this.api.setStorage('my.name', t.attrs.name);
              break;
            case 2:
              this.p.v.v = t.attrs.self_pr;
              this.api.setStorage('my.self_pr', t.attrs.self_pr);
              break;
            default:
              break;
          }
          this.navCtrl.pop();
        });
      }
    });
  }
}
