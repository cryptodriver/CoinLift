import { Component } from '@angular/core';
import { Platform, Events, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';

import { ApiProvider } from '../providers/api/api';
// import { FCM } from '@ionic-native/fcm';
import { Firebase } from '@ionic-native/firebase';
import { Badge } from '@ionic-native/badge';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  private _my: any = { id: 0, token: '', avatar: 'assets/imgs/avatar.png',
    name: '',  self_pr: '', currency: 'USD', notify: true, coins: ['BTC', 'ETH', 'BCH'] };

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard,
    events: Events, storage: Storage, ga: GoogleAnalytics, uniqueDeviceID: UniqueDeviceID, device: Device,
    alertCtrl: AlertController, toastCtrl: ToastController, public api: ApiProvider, fcm: Firebase, bag: Badge) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      keyboard.disableScroll(true);
      ga.startTrackerWithId('UA-91930300-1').then(() => {
        ga.trackView('app');
      }).catch((err: any) => {});
      events.subscribe('user:action', (key: string, data: any) => {
        if (key == 'signin') {
          storage.get('my').then((obj: any) => {
            storage.set('my', Object.assign(obj, data));
          });
        }
        if (key == 'signout') {
          storage.set('my', this._my);
        }
      });
      events.subscribe('app:action', (key: string, data: any) => {
        if (key == 'alert') {
          alertCtrl.create({
            title: data.title || 'CoinLift',
            subTitle: data.subTitle,
            buttons: ['閉じる']
          }).present();
        }
        if (key == 'toast') {
          toastCtrl.create({
            message: data.message,
            duration: data.duration || 3000,
            position: data.position || 'top'
          }).present();
        }

      });

      storage.get('my').then((obj: any) => {
        if (!obj) {
          obj = this._my;
          storage.set('my', this._my);
        }
        if (platform.is('cordova')) {
          uniqueDeviceID.get().then(uuid => {
            api.registerDevice({attrs: { uuid: uuid, os: (platform.is('ios')?'ios':(platform.is('android')?'android':(platform.is('windows')?'windows':'unknown'))) }}).then((res: any) => {
              if (obj.notify) {
                if (platform.is('ios')) {
                  fcm.grantPermission();
                }
                fcm.hasPermission().then(data => {
                  fcm.getToken().then(token => {
                    api.registerDevice({attrs: { uuid: uuid, token: token }}).then((res: any) => {
                      storage.set('token', token);
                      api.clearBadge({token: token }).then((res: any) => { });
                      bag.clear();
                    });

                    fcm.onNotificationOpen().subscribe((data: any) => {
                      storage.get('my').then((obj: any) => {
                        if (obj.notify) {
                          if(data.tap){
                            // backgroud
                          } else {
                            this.api.global.news_count += 1;
                          }
                        }
                      });
                    });
                  });
                });
              }
            });
          });
        }
      });

      platform.resume.subscribe(() => {
        storage.get('token').then((obj: any) => {
          if (obj) {
            api.clearBadge({token: obj }).then((res: any) => {
              //do nothing
            });
          }
        });
        bag.clear();
      });

    });
  }

}
