import {Component, ViewChild} from '@angular/core';
import {IonicApp, Platform, Nav, Keyboard, MenuController, AlertController, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NativeService} from "../providers/NativeService";
import {Storage} from '@ionic/storage';
import {Helper} from "../providers/Helper";
import {HomePage} from "../pages/home/home";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {MineEditModalPage} from "../pages/mine/mine-edit-modal/mine-edit-modal";
import {
  DEFAULT_AVATAR, EVENTS_ROBOT_SELECTED, EVENTS_ROBOT_SELECTED_NAME, EVENTS_ROBOT_STATUS,
  EVENTS_ROBOT_STATUS2
} from "../providers/Constants";
import {AboutPage} from "../pages/mine/about/about";
import {AppConfig} from "./app.config";
import {BusHttpAPI} from "../providers/BusHttpAPI";
import {Utils} from "../providers/Utils";
import {DomSanitizer} from "@angular/platform-browser";
// import {resolve} from "url";
import {RobotMQTT} from "../providers/robot-mqtt";
// import {ScreenOrientation} from "@ionic-native/screen-orientation";
import 'webrtc-adapter/out/adapter.js';
import {GlobalData} from "../providers/GlobalData";

declare var AppMinimize;
declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;
  // rootPage = TabsPage;
  // rootPage = LoginPage;
  // rootPage = MinePage;
  rootPage = HomePage;

  backButtonPressed: boolean = false;
  public userInfo ={};
  public token='';
  // avatarBase64: string = DEFAULT_AVATAR;
  avatarBase64: string ;
  isIos: boolean;
  //拥有及被授权的机器人
  public roleUser =[];
  // public roleUser =[{"deviceId":"robot1719000001","userId":"18658862111","ownerFlag":1,"authFlag":2,"deviceNick":"小白","deviceAvatar":"","groupName":""}];
  // public roleUser =[{'deviceId':'40161701000001','userId':'18658862111','deviceNick':'master1',
  //   'deviceAvatar':'','authFlag':2,'ownerFlag':1,'groupName':''},
  //   {
  //     'deviceId':'40161701000002','userId':'18658862111','deviceNick':'slave1',
  //     'deviceAvatar':'','authFlag':1,'ownerFlag':0,'groupName':''},
  //   {
  //     'deviceId':'40161701000003','userId':'18658862111','deviceNick':'slave2',
  //     'deviceAvatar':'','authFlag':1,'ownerFlag':0,'groupName':''}
  // ];

  constructor(
              private ionicApp: IonicApp,
              private platform: Platform,
              private keyboard: Keyboard,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private nativeService: NativeService,
              private storage: Storage,
              private helper:Helper,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              private menuCtrl:MenuController,
              private http:BusHttpAPI,
              private _DomSanitizationService:DomSanitizer,
              private mqtt:RobotMQTT,
              private events: Events
              // private screeOrientation:ScreenOrientation
              ) {

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
      // if (this.nativeService.isMobile())
      //   this.screeOrientation.lock(this.screeOrientation.ORIENTATIONS.PORTRAIT);
      this.registerBackButtonAction();//注册返回按键事件
      this.assertNetwork();//检测网络
      this.registerAuth(); //鉴权
      this.events.subscribe('Re-Login',()=>{
        this.clearInfoCache();
        this.helper.goLogin(res => {
          if (res) {
            this.userInfo = res.userInfo;
            this.roleUser = res.roleUser;
            // console.log('*************************************************');
            console.log(this.roleUser);
            // this.nativeService.presentAlert(this.roleUser);

            // console.log('this.userInfo.avatar:|'+!this.userInfo['avatar']+'|'+this.userInfo['avatar'])
            if(!this.userInfo['avatar'])
              this.userInfo['avatar']=DEFAULT_AVATAR;

            // console.log('mobile:'+this.userInfo['mobile']+'|nick:'+this.userInfo['nick']
            //   +'|name:'+this.userInfo['name']+'|email:'+this.userInfo['email']);

            this.storage.get('upass').then((res)=>{
              this.mqtt.connectToMqtt(this.userInfo['mobile'],res);
            });

            this.initPage();
            this.ititSelectedRobot();

          }
          this.menuCtrl.close('filterMenu');
        });
      });
      // this.nativeService.detectionUpgrade();//检测app是否升级

      try {
        if ((<any>window).device.platform === 'iOS') {
          cordova.plugins.iosrtc.registerGlobals();
        }
      } catch (error) {
        console.log(error);

      }


    });
    this.isIos = this.nativeService.isIos();
  }

  freshData(){
    return new Promise((resolve,reject) => {
    this.storage.get('UserInfo').then( res =>{
      if(res){
        this.userInfo = JSON.parse(res);
        console.log(this.userInfo);
        this.initPage();
        this.http.post('', Utils.buildPayLoad(this.userInfo['mobile'] + '@user', 'admin@robot', 'rosterListOfUser', '1', {}), 'rosterListOfUser')
          .then((res:any)=>{
            this.roleUser = res;
            resolve();

          });
      }
    });
    // this.http.post('', Utils.buildPayLoad(this.userInfo['mobile'] + '@user', 'admin@robot', 'rosterListOfUser', '1', {}), 'rosterListOfUser')
    //   .then((res:any)=>{
    //     this.roleUser = res;
    //
    //
    //     console.log('-----------------------------------------------------------------------------------');
    //     console.log('this.roleUser:'+this.roleUser);
    //     console.log('this.roleUser[0]:'+this.roleUser[0]);
    //
    //     console.log('-----------------------------------------------------------------------------------');
    //
    //
    //   });
  });
  }

  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.nativeService.showToast('请连接网络');
    }
  }

  registerAuth(){
    this.storage.get('UserInfo').then(res =>{
      // if(1==1){
      //
      // }else {

        if (res) {

          // this.nativeService.presentAlert(res);
          this.userInfo = JSON.parse(res);
          // console.log('mobile:' + this.userInfo['mobile'] + '|nick:' + this.userInfo['nick']
          //   + '|name:' + this.userInfo['name'] + '|email:' + this.userInfo['email']);
          if (!this.userInfo['avatar'])
            this.userInfo['avatar'] = DEFAULT_AVATAR;

          this.storage.get('upass').then((res) => {
            this.mqtt.connectToMqtt(this.userInfo['mobile'], res);
          });
          this.initPage();
          this.ititSelectedRobot();
          AppConfig.setUserInfo(res);
        } else {
          this.clearInfoCache();
          this.helper.goLogin(res => {
            // this.token = res2;
            this.userInfo = res.userInfo;
            this.roleUser = res.roleUser;
            console.log('*************************************************');
            console.log(this.roleUser);
            console.log(JSON.stringify(this.roleUser));

            if (!this.userInfo['avatar'])
              this.userInfo['avatar'] = DEFAULT_AVATAR;

            // console.log('mobile:' + this.userInfo['mobile'] + '|nick:' + this.userInfo['nick']
            //   + '|name:' + this.userInfo['name'] + '|email:' + this.userInfo['email']);
            this.storage.get('upass').then((res) => {
              this.mqtt.connectToMqtt(this.userInfo['mobile'], res);
            });
            this.initPage();
            this.ititSelectedRobot();
          });
        }
      // }
    });

  }


  scanBarcode(){
    this.barcodeScanner.scan().then((barcodeData) => {
        this.nativeService.showToast(barcodeData.text);
        console.log('Barcode Format ->' + barcodeData.format);
        console.log('Cancelled -> ' + barcodeData.cancelled);

        let flag =true;
        console.log('is number:'+typeof barcodeData.cancelled =='number');
        console.log('is string:'+typeof barcodeData.cancelled =='string');

        if(typeof barcodeData.cancelled =='number' && barcodeData.cancelled==1)
            flag =false;

        if (flag==false ||barcodeData.cancelled == false ) {

          var param = {
            'deviceId': 'robot1719000001',
            'dpass': 'hIA9HHQB'
          };
          this.http.post('', Utils.buildPayLoad(this.userInfo['mobile'] + '@user', 'admin@robot',
            'deviceBind', '1', param), 'deviceBind').then(res => {
            if (res == true) {
              this.http.post('', Utils.buildPayLoad(this.userInfo['mobile'] + '@user', 'admin@robot', 'rosterListOfUser', '1', {}), 'rosterListOfUser')
                .then(res => {

                  // this.roleUser.push({'deviceId':'40161701000002','userId':'18658862111','deviceNick':'slave2',
                  //   'deviceAvatar':'','authFlag':2,'ownerFlag':1,'groupName':''});
                });
              this.nativeService.showToast('绑定设备成功!');
              this.menuCtrl.close('filterMenu');
            } else {
              this.nativeService.showToast('绑定设备失败!' + JSON.stringify(res));
            }
          });
        }
      }, (err) => {
        console.log("error:" + err.message);
      }
    );
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      let activeVC = this.nav.getActive();
      let tabs = activeVC.instance.tabs;
      let activeNav = tabs.getSelected();
      return activeNav.canGoBack() ? activeNav.pop() : AppMinimize.minimize();//this.showExit()

    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.clearInfoCache();
      this.platform.exitApp();
    } else {
      this.nativeService.showToast('再按一次退出应用');
      this.backButtonPressed = true;
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }


  about() {
    this.nav.push(AboutPage);
    this.menuCtrl.close('filterMenu');
  }

  edit() {
    // this.navCtrl.push(MineEditPage, this.userInfo);
    // console.log("this.userInfo['avatar']:"+this.userInfo['avatar']);
    this.nav.push(MineEditModalPage, {userInfo:this.userInfo});
    this.menuCtrl.close('filterMenu');

    // let modal = this.modalCtrl.create(MineEditModalPage, {'UserInfo':this.userInfo});
    // modal.present();
    // modal.onDidDismiss(userInfo => {
    //   userInfo && (this.userInfo = userInfo)
    // });
  }

  avatarCallback(params){
    let that =this;
    return new Promise((resolve,reject) =>{
        if(typeof (params) !='undefined'){
          that.userInfo['avatar']=Utils.converAvartarToBase64(params);
          that.avatarBase64 = Utils.converAvartarToBase64(params);
          console.log('params:|'+params);
          console.log('avatarBase64:|'+that.avatarBase64);
          resolve('ok');
        }else{
          reject(Error('error'));
        }
    });
  }


  ititSelectedRobot(){
    this.freshData().then(res =>{

      let robot;
      this.storage.get('robot').then(res=>{
        // console.log(')))))))))))))))))))))))))))))))))))))');
        // if(this.roleUser.length==0){
        //   console.log(')))))))))))))))))))))))))))))))))))))');
        //   this.nativeService.presentAlert("请首先添加设备！");
        //   this.scanBarcode();
        // }else

          if(res){
          robot = JSON.parse(res);
          for (let item of this.roleUser){
            if(item['deviceId']==robot['deviceId']){
              console.log(item);
              this.goSelectedRobot(item);
              break;
            }
          }
          this.goSelectedRobot(this.roleUser[0]);
        }else {
          this.goSelectedRobot(this.roleUser[0]);
        }
      });

    });



  }


  initPage() {
    //加载用户头像
    // this.helper.getUserAvatar().then(avatarPath => {
    //
    //   console.log('*********avatarPath******'+avatarPath);
    //   if(!this.userInfo['avatar'])
    //     this.userInfo['avatar']=DEFAULT_AVATAR;
    //
    //   this.avatarBase64 = Utils.converAvartarToBase64(<string>avatarPath);
    // });
    this.avatarBase64 =this.userInfo['avatar'];
  }

  goSelectedRobot(item){

    this.storage.set('robot',JSON.stringify(item));
    this.unSubscribeTopic();
    console.log('*********************************publish EVENTS_ROBOT_SELECTED:'+item.deviceId);
    this.events.publish(EVENTS_ROBOT_SELECTED,item.deviceId);

    // this.storage.set('mobile',this.userInfo['mobile']).then((res) =>{
    console.log('*********************************publish EVENTS_ROBOT_SELECTED_NAME:'+item.deviceNick);
    this.events.publish(EVENTS_ROBOT_SELECTED_NAME,item.deviceNick);
    // });

    this.menuCtrl.close('filterMenu');
  }

  clearInfoCache(){
    this.storage.remove('UserInfo').then(res=>{
      // console.log('storeage.UserInfo:'+JSON.stringify(this.storage.get('Userinfo'))+'|'+res+'|'+JSON.stringify(res));
    },err =>{
      // console.log('storeage.UserInfo.err:'+err+'|'+JSON.stringify(err));
    });
    this.storage.remove('upass').then(res =>{
      // console.log('storeage.upass:'+JSON.stringify(this.storage.get('upass'))+res+'|'+JSON.stringify(res));
    },err =>{
      // console.log('storeage.upass.err:'+err+'|'+JSON.stringify(err));
    });
    // this.storage.remove('mobile').then(res =>{
    //   // console.log('storeage.mobile:'+JSON.stringify(this.storage.get('mobile'))+res+'|'+JSON.stringify(res));
    // },err =>{
    //   // console.log('storeage.mobile.err:'+err+'|'+JSON.stringify(err));
    // });
    this.storage.remove('token').then(res =>{
      // console.log('storeage.token:'+JSON.stringify(this.storage.get('token'))+'|'+res+'|'+JSON.stringify(res));
    },err =>{
      // console.log('storeage.token.err:'+err+'|'+JSON.stringify(err));
    })
    // this.storage.remove('robot');

    AppConfig.setPass('');
    AppConfig.setMobile('');
    AppConfig.setToken('');
    AppConfig.setUserInfo({});

    // this.mqtt.disConnect();
  }


  unSubscribeTopic(){
    console.log('********************unSubscribeTopic************************');
    for(let i=0; i<this.roleUser.length;i++){

      console.log('unSubscribeTopic : '+EVENTS_ROBOT_STATUS+this.roleUser[i]['deviceId']);
      this.events.unsubscribe(EVENTS_ROBOT_STATUS+this.roleUser[i]['deviceId']);
      this.events.unsubscribe(EVENTS_ROBOT_STATUS2+this.roleUser[i]['deviceId']);
    }
  }

  loginOut() {
    this.alertCtrl.create({
      title: '确认重新登录？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            var param={'mobile':this.userInfo['mobile']};
            this.http.post('',Utils.buildPayLoad(this.userInfo['mobile'] + '@user', 'admin@robot',
              'userLogout', '1', param),'userLogout');
              this.clearInfoCache();
              this.helper.goLogin(res => {
                if (res) {
                  this.userInfo = res.userInfo;
                  this.roleUser = res.roleUser;
                  // console.log('*************************************************');
                  console.log(this.roleUser);
                  // this.nativeService.presentAlert(this.roleUser);

                  // console.log('this.userInfo.avatar:|'+!this.userInfo['avatar']+'|'+this.userInfo['avatar'])
                  if(!this.userInfo['avatar'])
                    this.userInfo['avatar']=DEFAULT_AVATAR;

                  console.log('mobile:'+this.userInfo['mobile']+'|nick:'+this.userInfo['nick']
                    +'|name:'+this.userInfo['name']+'|email:'+this.userInfo['email']);

                  this.storage.get('upass').then((res)=>{
                    this.mqtt.connectToMqtt(this.userInfo['mobile'],res);
                  });

                  this.initPage();
                  this.ititSelectedRobot();
                }
                this.menuCtrl.close('filterMenu');
              });
            // });
          }
        }
      ]
    }).present();
  }

  features() {
    this.nativeService.showToast('正在完善...');
  }
  // exitSoftware() {
  //   this.alertCtrl.create({
  //     title: '确认退出软件？',
  //     buttons: [{text: '取消'},
  //       {
  //         text: '确定',
  //         handler: () => {
  //           this.platform.exitApp();
  //         }
  //       }
  //     ]
  //   }).present();
  // }


}
