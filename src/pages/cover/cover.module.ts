import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoverPage } from './cover';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CoverPage,
  ],
  imports: [
    IonicPageModule.forChild(CoverPage),
    PipesModule,
  ],
})
export class CoverPageModule {}
