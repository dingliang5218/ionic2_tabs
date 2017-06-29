import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UserInfo} from "../../model/UserInfo";
import {Http,Response} from "@angular/http";

@Injectable()
export class LoginService {
  constructor(private http:Http) {
  }


  login(user): Observable<UserInfo> {
    return this.http.get('/assets/json/userinfo.json',user).
      map(
        (res:Response) => res.json()
    );
    // return this.httpService.post('/app/bugRepair/login', user).map((res: Response) =>  res.json());
    // let userInfo = {
    //   id: user.username,
    //   username: user.username,
    //   name: user.username,
    //   email: 'yanxiaojun617@163.com',
    //   phone: '18688498342',
    //   avatar: '',
    //   description: '有图有真相，一本正经的胡说八道..'
    // };
    // return Observable.create((observer) => {
    //   observer.next(userInfo);
    // });
  }

  register(user):Observable<Response>{
    return this.http.get('/assets/json/userinfo.json',user).
       map((res:Response) => res.json());
  }

  findPwd(user):Observable<Response>{
    return this.http.get('/assets/json/userinfo.json',user).map((res:Response) => res.json());
  }

  getVerCode(mobile):Observable<Response>{
    return this.http.get('/assets/json/userinfo.json',mobile).map((res:Response) => res.json());
  }
}
