import {Component} from '@angular/core';
import {ModalController, ViewController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {FormBuilder} from '@angular/forms';
import {Validators} from '../../providers/Validators'

import {LoginService} from './LoginService';

import {FindPasswordPage} from './find-password/find-password';
import {RegisterPage} from './register/register';
import {UserInfo} from "../../model/UserInfo";
import {BusHttpAPI} from "../../providers/BusHttpAPI";
import {Utils} from "../../providers/Utils";
import {AppConfig} from "../../app/app.config";
import {RobotMQTT} from "../../providers/robot-mqtt";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage {
  userInfo ={};
  submitted: boolean = false;
  canLeave: boolean = false;
  loginForm: any =null;
  mobile:any;

  constructor(private viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private storage: Storage,
              private modalCtrl: ModalController,
              private mqtt :RobotMQTT,
              private http:BusHttpAPI
              // private storage:StorageService
  ) {

    this.loginForm = this.formBuilder.group({
      username:[,[Validators.required,Validators.phone]],
      password:[,[Validators.required,Validators.minLength(6)]]
    });
    this.storage.get('mobile').then(res =>{
      this.mobile = JSON.parse(res) ||'';
      this.loginForm.setValue({username: this.mobile,password:''});
    });

  }

  ionViewWillEnter() {

    this.storage.get('UserInfo').then(userInfo => {
      this.userInfo = JSON.parse(userInfo) || null;
     });
  }

  // ionViewCanLeave(): boolean {
  //   let bool = !!this.userInfo;
  //   if (this.canLeave || bool) {
  //     return true;
  //   } else {
  //     this.alertCtrl.create({
  //       title: '确认退出软件？',
  //       buttons: [{text: '取消'},
  //         {
  //           text: '确定',
  //           handler: () => {
  //             this.platform.exitApp();
  //           }
  //         }
  //       ]
  //     }).present();
  //     return false;
  //   }
  // }

  login(user) {
    this.mqtt.disConnect();

    this.submitted = true;
    var param = {
      'upass': Utils.getStrMD5(user.password), 'mobile': user.username
    };
    //登录
    this.http.post('', Utils.buildPayLoad(user.username + '@user', 'admin@robot', 'userLogin', '1', param), 'userLogin')
      .then((res: any) => {
          console.log('token:' + res.token);
        AppConfig.setToken(res.token)
          // this.nativeService.showToast(res.token);
          this.storage.set('token', res.token).then(res => {
            console.log('set token successful');
            this.storage.set('upass', Utils.getStrMD5(user.password)).then(res =>{
              console.log('set upass successful');
              AppConfig.setMobile(user.username);
              AppConfig.setPass(Utils.getStrMD5(user.password).toString());
              this.storage.set('mobile',user.username);
              this.submitted = false;
              var param2 ={
                'id':AppConfig.getToken()
              }

              this.storage.get('token').then( res =>{
                console.log('login.token:'+res);
                this.storage.get('upass').then(res2 =>{
                  console.log('login.upass:'+res2);
                  this.storage.get('mobile').then(res3 =>{
                    console.log('login.mobile:'+res3);
                  });
                });
              });

              //请求用户信息
              this.http.post('', Utils.buildPayLoad(user.username + '@user', 'admin@robot', 'userShow', '1', param2), 'userShow')
                .then((res:any) =>{

                  console.log('mobile:'+res.mobile+'|nick:'+res.nick+'|name:'+res.name+'|email:'+res.email
                    // +'avatar:'+res.avatar
                  );
                  this.storage.set('UserInfo',JSON.stringify(res));
                  this.userInfo = res;


                  this.viewCtrl.dismiss({userInfo:this.userInfo});
                });
            },err =>{
              console.log('set upass fail:'+JSON.stringify(err))
            });
          },err =>{
            console.log('set token fail:'+JSON.stringify(err))
          });
        });

    // this.submitted = true;
    // var params={
    //   "phone":user.username,
    //   "password":user.password
    // };
    // // this.nativeService.showLoading("登录中...")
    // this.http.get('/assets/json/userinfo.json',params).then((res:any) => {
    //     if(res){
    //       console.log(res);
    //       console.log(res.name);
    //       this.storage.set('UserInfo',JSON.stringify(res[0]));
    //       this.submitted = false;
    //       this.userInfo = res[0];
    //       // console.log('userInfo  ', this.userInfo.robotName);
    //       this.viewCtrl.dismiss(this.userInfo);
    //
    //     }
    //   }
    // );
  }


  toRegister() {

    // this.mqtt.connectToMqtt('18658862111',Utils.getStrMD5('000000').toString());


    this.canLeave = true;
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
    this.canLeave = false;
  }

  toFindPassword() {

    // this.mqtt.disConnect();

    this.canLeave = true;
    let modal = this.modalCtrl.create(FindPasswordPage);
    modal.present();
    this.canLeave = false
  }

}
