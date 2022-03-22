import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { BoardPage } from '../pages/board/board';
import { NewsPage } from '../pages/news/news';
import { MyPage } from '../pages/my/my';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { IonicStorageModule } from '@ionic/storage';
import { PipesModule } from '../pipes/pipes.module';
// import { FCM } from '@ionic-native/fcm';
import { Firebase } from '@ionic-native/firebase';
import { Badge } from '@ionic-native/badge';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EmailComposer } from '@ionic-native/email-composer';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { ApiProvider } from '../providers/api/api';

import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    MyApp,
    // NewsPage,
    // BoardPage,
    // MyPage,
    HomePage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgPipesModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    PipesModule,
    IonicImageViewerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // NewsPage,
    // BoardPage,
    // MyPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Camera,
    PhotoLibrary,
    SocialSharing,
    Crop,
    Base64,
    // FCM,
    Firebase,
    Badge,
    GoogleAnalytics,
    InAppBrowser,
    EmailComposer,
    UniqueDeviceID,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider
  ]
})
export class AppModule {}
