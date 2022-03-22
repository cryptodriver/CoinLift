import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class ApiProvider {

  public global: any = {
    news_count: 0
  };

  private urls: any = {
    cmc: 'https://api.coinmarketcap.com/v2',
    dog: 'http://localhost:3000/v1'
  }

  constructor(public http: HttpClient, public storage: Storage, public events: Events) {
    console.log('Hello ApiProvider Provider');
  }

  setStorage(k, v) {
    this.storage.get((k.split('.'))[0]).then((obj) => {
      if (obj) {
        obj[(k.split('.'))[1]] = v;
        this.storage.set((k.split('.'))[0], obj);
      }
    });
  }

  initStorage(k, v) {
    this.storage.set(k,v);
  }

  getStorage(k) {
    return new Promise(resolve => {
      this.storage.get((k.split('.'))[0]).then((obj) => {
        resolve(obj);
      });
    });
  }

  getListings() {
    return new Promise(resolve => {
      this.http.get(this.urls.cmc+'/listings/').subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  getTicker(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.cmc+'/ticker/'+data.id+'/?convert='+data.currency).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  getCoins(start = 1, limit = 100, convert = '', sort = 'rank') {
    return new Promise(resolve => {
      this.http.get(this.urls.cmc+'/ticker/?start='+start+'limit='+limit+'&sort='+sort+'&convert='+convert+'&structure=array').subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  getGlobal(convert = 'USD') {
    return new Promise(resolve => {
      this.http.get(this.urls.cmc+'/global/?convert='+convert).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  listNews(last = '2099-12-31 00:00:00', limit = 10) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/news/list?created_at='+last+'&limit='+limit).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  listPosts(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/board/list?created_at='+data.last+'&target='+data.target+'&limit='+data.limit, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token
        }}).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  postDetail(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/board/detail?id='+data.id, { headers:
        {
          'Content-Type': 'application/json'
        }}).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  reviewPost(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/board/review', { id: data.id, attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  deletePost(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/board/delete', { id: data.id }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  usersCover(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/profile/cover?id='+data.user_id, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  usersPost(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/board/users?id='+data.user_id+'&created_at'+data.last+'&limit='+data.limit, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  deleteComment(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/comment/delete', { id: data.id }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  listRelation(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/relation/list', { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  relationFollow(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/relation/follow', { attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  relationBlock(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/relation/block', { attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  publishPost(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/board/post  ', { attrs: data.attrs, imgs: data.imgs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  replyPost(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/comment/reply  ', { attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  reviewNews(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/news/review', data, { headers:
        {
          'Content-Type': 'application/json'
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  reviewComment(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/comment/review', { id: data.id, attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  clearBadge(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/devices/clear', { token: data.token }, {headers: {'Content-Type': 'application/json'}}).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  registerDevice(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/devices/register', data, {headers: {'Content-Type': 'application/json'}}).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  signin(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/signin', { email: data.email, password: data.password }, { headers:
        {
          'Content-Type': 'application/json',
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve({err: true});
      });
    });
  }

  referProfile(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/profile/refer', { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  signout(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/signout', { }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve({err: true});
      });
    });
  }

  signup(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/signup', { attrs: { email: data.email, password: data.password } }, { headers:
        {
          'Content-Type': 'application/json',
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        resolve({err: true});
      });
    });
  }

  vertify(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/vertify', { email: data.email }, { headers:
        {
          'Content-Type': 'application/json',
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  changeProfile(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/profile/change', { attrs: data.attrs }, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  getSetting(data) {
    return new Promise(resolve => {
      this.http.get(this.urls.dog+'/setting/get', { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

  setSetting(data) {
    return new Promise(resolve => {
      this.http.post(this.urls.dog+'/setting/set', { value: data}, { headers:
        {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + data.token,
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        console.log(err);
      });
    });
  }

}
