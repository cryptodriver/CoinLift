import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoardPage } from './board';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BoardPage,
  ],
  imports: [
    IonicPageModule.forChild(BoardPage),
    PipesModule,
  ],
})
export class BoardPageModule {}
