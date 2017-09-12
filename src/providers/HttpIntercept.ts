import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, ConnectionBackend, RequestOptionsArgs} from '@angular/http';


import {Observable} from "rxjs";
import {HttpInterceptHandle} from "./HttpInterceptHandle";
import {Utils} from "./Utils";
import {AppConfig} from "../app/app.config";
import {CONTROL_ACT_LOGIN, CONTROL_ACT_LOGOUT, CONTROL_ACT_PASCHANGE, CONTROL_ACT_REGISTER} from "./Constants";

@Injectable()
export class HttpIntercept extends Http {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, public _: HttpInterceptHandle) {
    super(backend, defaultOptions);
  }

  initHeader(url,options ?: RequestOptionsArgs){
    if(url==CONTROL_ACT_LOGIN||url==CONTROL_ACT_LOGOUT||url==CONTROL_ACT_PASCHANGE||url==CONTROL_ACT_REGISTER
        ||url==CONTROL_ACT_REGISTER){
      options.headers.set("token",'');
      options.headers.set("sign",'');
    }else{
      options.headers.set("token",AppConfig.getToken());
      options.headers.set("sign",Utils.getAPIMD5(AppConfig.getPass()));
    }
  }

  get(url: string, options ?: RequestOptionsArgs,): Observable < Response > {
    // this.initHeader(url,options);



    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.get(url, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.post(url, body, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.put(url, body, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }

  delete(url: string, options ?: RequestOptionsArgs): Observable < Response > {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.delete(url, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.patch(url, body, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }


  head(url: string, options ?: RequestOptionsArgs): Observable < Response > {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.head(url, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }


  options(url: string, options ?: RequestOptionsArgs): Observable < Response > {
    this._.events.publish("request:before", url, options);
    return Observable.create((observer) => {
      super.options(url, options).subscribe(res => {
        this._.events.publish("request:success", url, options, res);
        observer.next(res);
      }, err => {
        this._.events.publish("request:error", url, options, err);
        observer.error(err);
      });
    });
  }

}
