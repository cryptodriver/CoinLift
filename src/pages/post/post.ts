import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  @ViewChild('input') input ;

  public form: FormGroup;

  private data: any = { imgs: [ ] };

  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera,
    public api: ApiProvider, private frmBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    this.form = this.frmBuilder.group({
      content: new FormControl('', [ Validators.required, Validators.maxLength(80) ])
    });
    this.loading = this.loadingCtrl.create({
      duration: 3000
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
        this.input.setFocus();
    }, 1000);
  }

  doSubmit() {
    this.api.getStorage('my').then((obj: any) => {
      let imgs = [];
      for(let o of this.data.imgs) {
        imgs.push(o.url)
      }

      this.loading.present();
      this.api.publishPost({
        token: obj.token,
        attrs: {
          content: this.form.value['content']
        },
        imgs: imgs
      }).then((res: any) => {
        this.loading.dismiss();
        this.navCtrl.pop();
      });
    });
  }

  ngAfterViewChecked() {
    // this.input.setFocus();
  }

  doAction(k, v?) {
    switch(k) {
      case 1:
        this.data.imgs.splice(this.data.imgs.findIndex(d => d.id === v), 1);
        break;
      case 2:
        this.camera.getPicture({
          quality: 80,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 320,
          targetHeight: 640
        }).then((uri) => {
          this.data.imgs.push({ id: 1, url: 'data:image/jpeg;base64,' + uri });
        }, (err) => {
        });
        break;
      default:
        break;
    }
  }

}
