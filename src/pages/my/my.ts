import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, normalizeURL } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { Storage } from '@ionic/storage';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-my',
  templateUrl: 'my.html',
})
export class MyPage {

  public data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public camera: Camera,
    private crop: Crop, private base64: Base64, public storage: Storage,
    public api: ApiProvider) {
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.storage.get('my').then((obj: any) => {
      this.data = obj;
    });
  }

  doSignin() {
    let page = this.modalCtrl.create('SigninPage');
    page.onDidDismiss(() => {
      this.refresh();
    });
    page.present();
  }

  doAvatar() {
    this.camera.getPicture({
      quality: 90,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 144,
      targetHeight: 144,
    }).then((uri) => {
      this.crop.crop(uri, { quality: 60, targetHeight: 72, targetWidth: 72 }).then(
        image => {
          this.base64.encodeFile(normalizeURL(image)).then((base64File: string) => {
            this.api.changeProfile({ token: this.data.token, attrs: { avatar: base64File } }).then((res: any) => {
              this.api.setStorage('my.avatar', base64File);
              this.data.avatar = base64File;
            });
          }, (err) => {
            console.log(err);
          });
        },
        error => console.error('Error cropping image', error)
      );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  doProfile() {
    this.navCtrl.push('ProfilePage');
  }

  doSetting(k, v?) {
    this.navCtrl.push('SettingPage', {k: k, v});
  }

}
