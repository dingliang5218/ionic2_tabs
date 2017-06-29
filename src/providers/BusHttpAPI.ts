import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NativeService} from "./NativeService";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {CONTROL_ACT_VERIFYCODE, CONTROL_URL_HTTP, ERROR_MESSAGE04} from "./Constants";
import {Utils} from "./Utils";
import {AppConfig} from "../app/app.config";
import {App, Events} from "ionic-angular";
/**
 * Created by lding on 2017/4/26.
 */


@Injectable()
export class BusHttpAPI {

  private token ='';
  private passmd5='';

  constructor(public http: Http, public storage: Storage, public uiService: NativeService
            ,public events: Events) {
  }



  post(url, params,act?) {
    var path = CONTROL_URL_HTTP + url;
    this.storage.get('token').then(res => {
      this.token = res;
    }, err => {
      this.token = '';
    });

    this.storage.get('upass').then(res => {
      this.passmd5 = res;
    }, err => {
      this.passmd5 = '';
    });
    if(Utils.isEmpty(this.token))
      this.token = AppConfig.getToken();
    if(Utils.isEmpty(this.passmd5))
      this.passmd5 = AppConfig.getPass();

    var sign =Utils.getAPIMD5(this.passmd5);
    console.log('===================================='+act+'====================================');
    console.log('请求地址' + path+'|token:'+this.token+'|passmd5:'+this.passmd5+'|sign:'+sign);
    console.log('===================================='+act+'====================================');


    return new Promise((resolve, reject) => {
      let headers = new Headers({
        'token': this.token, 'sign': sign
      });
      let options = new RequestOptions({headers: headers});
      this.http.post(path, params, options).map((res: Response) => res.json()).subscribe(res => {
        console.log('res:'+JSON.stringify(res));
        console.log('status:'+JSON.stringify(res['status']));
        console.log('result:'+JSON.stringify(res['result']));
        let respCode = res['status'];
        if (respCode != 200) {
          this.uiService.showToast(respCode+','+Utils.converTOPersentMsg(res['result']));
          if(respCode=='404' && res['result']==ERROR_MESSAGE04){
            this.events.publish('Re-Login');
          }
          reject(res);
        } else {
          // this.uiService.presentAlert(res.id+'|'+res.from+'|'+res.to+'|'+res.act+'|'+res.type);
          res.hasOwnProperty('result')?resolve(res.result):resolve(res);
        }
      }, err => {
        console.log('err:'+JSON.stringify(err));
        reject(err);
      });
    });
  }

  get(url, params) {
    url = CONTROL_URL_HTTP + url;
    console.log("请求地址" + url);


    return new Promise((resolve, reject) => {
      this.storage.get('token').then(res => {
        params.token = res;

        //获取登录的token
        console.log('params  ', params);

        url = url + "?" + Object.keys(params).map(key => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
          }).join('&');


        this.http.get(url).map((res: Response) => res.json()).subscribe(res => {
          let respCode = res['respCode']
          if (respCode != '100200') {
            if (respCode != '101704' && respCode != '101705' && respCode != '101604') {
              this.uiService.showToast(res['respMsg']);
            }
            reject(res);
          } else {
            res.hasOwnProperty('data') ? resolve(res.data) : resolve(res);
          }
        }, err => {
          reject(err);
        });
      });

    })

  }
}
