import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NewsPage } from '../news/news';
import { BoardPage } from '../board/board';
import { MyPage } from '../my/my';

import { ApiProvider } from '../../providers/api/api';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NewsPage;
  tab3Root = BoardPage;
  tab4Root = MyPage;

  constructor(public api: ApiProvider) {

  }

}
