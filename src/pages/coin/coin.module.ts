import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoinPage } from './coin';


@NgModule({
  declarations: [
    CoinPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinPage),
  ],
})
export class CoinPageModule {}
