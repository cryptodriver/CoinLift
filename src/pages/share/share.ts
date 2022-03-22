import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import html2canvas from 'html2canvas';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';


@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  @ViewChild('div') div;

  private url : any;
  private data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private photoLib: PhotoLibrary, private snsShare: SocialSharing,
    public viewCtrl: ViewController) {
      this.data = this.navParams.data;
  }

  ionViewDidLoad() {
    html2canvas(this.div.nativeElement).then( canvas=> {
      this.url = canvas.toDataURL("image/png");
    });
  }

  doShare(k, v?) {

    switch(k) {
      case 1:
        this.photoLib.requestAuthorization().then(() => {
          this.photoLib.saveImage(this.url, 'consin').then((entry=>{
            alert('カメラロールに保存しました');
          }),
          (error) => { });
        }).catch(err => console.log('permissions weren\'t granted'));
        break;
      case 2:
        this.viewCtrl.dismiss();
        break;
      case 3:
        this.snsShare.share('', '', this.url).then(() => {
        }).catch(() => { console.log('permissions weren\'t granted') });
        break;
      default:
        break;
    }
  }

}
