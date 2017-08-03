import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Validators} from '../../../providers/Validators'
import {Observable} from "rxjs";
import {LoginService} from "../LoginService";
import {BusHttpAPI} from "../../../providers/BusHttpAPI";
import {Utils} from "../../../providers/Utils";
import {NativeService} from "../../../providers/NativeService";
import {Storage} from "@ionic/storage";
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [LoginService]
})
export class RegisterPage {
  registerForm: any;
  canClick:boolean = false;
  description: string = "获取验证码";
  subscription:any;

  constructor(public uiService: NativeService,
              private formBuilder: FormBuilder,
              public storage: Storage,
              private viewCtrl: ViewController,
              private http: BusHttpAPI) {
    this.registerForm = this.formBuilder.group({
      username: [, [Validators.required, Validators.phone]],
      verificationCode: [, [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]{6}')]],
      password: [, [Validators.required,Validators.minLength(6)]]
    })
  };


  sendCode(mobile){

    console.log(mobile);
    var reg1 = /^[1][34578]\d{9}$/;

    if (!mobile.username) {

      let alert = "手机号码不能为空";
      this.uiService.presentAlert(alert);

    } else if (!reg1.test(mobile.username)) {

      let alert = "手机号码输入有误";
      this.uiService.presentAlert(alert);

    } else {

      var param = {'mobile': mobile.username};
      this.http.post('', Utils.buildPayLoad(mobile.username + '@user', 'admin@robot', 'codeGenerate', 1, param),'codeGenerate')
        .then((res: any) => {
          this.countdown(60);
        });
    }
  }

  confirm(user) {
    var param = {'upass': Utils.getStrMD5(user.password), 'mobile': user.username, 'verifycode': user.verificationCode};
    this.http.post('', Utils.buildPayLoad(user.username + '@user', 'admin@robot', 'userRegister', '1', param), 'userRegister')
      .then((res: any) => {
        this.uiService.presentAlert(res.token);
        this.subscription.unsubscribe();
        this.description = "获取验证码";
        this.canClick = false;
        this.viewCtrl.dismiss();
      },err =>{
        this.subscription.unsubscribe();
        this.description = "获取验证码";
        this.canClick = false;
      });
  }



  countdown(second){
    // var second = parseInt(that.second);
    this.subscription = Observable.timer(1000,1000).subscribe(() => {
        if (second <= 0) {
          this.description = "获取验证码";
          this.canClick = false;
        } else {
          console.log("倒计时" + second + "s");
          this.description = second + "s后重发";
          second--;
          this.canClick = true;
        }
      }
    );
    setTimeout(() =>{
      this.subscription.unsubscribe();
    },second*1000+2000);
  }

  dismiss() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.description = "获取验证码";
      this.canClick = false;
    }
    this.viewCtrl.dismiss();
  }

}
