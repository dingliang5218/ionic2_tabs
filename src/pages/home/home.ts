import {ApplicationRef, Component} from '@angular/core';

import {ActionSheetController, Events, MenuController, ModalController, NavController, Platform} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {MinePage} from "../mine/mine";
import {ChatPage} from "../chat/chat";
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import {Utils} from "../../providers/Utils";
import {clearTimeout} from "timers";


import Timer = NodeJS.Timer;
import {Storage} from "@ionic/storage";
import {RobotMQTT} from "../../providers/robot-mqtt";
import {EVENTS_ROBOT_SELECTED, EVENTS_ROBOT_STATUS, EVENTS_ROBOT_STATUS2} from "../../providers/Constants";
import {CallModalPage} from "../chat/call-modal/call-modal";
import {VideoService} from "../../providers/video";


import set = Reflect.set;

declare var
  window:any,
  RTCSessionDescription:any,
  RTCPeerConnection:any,
  RTCIceCandidate:any;

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  data = {
    status: 1,//1未录音,2正在录音
    timer: '00:00:00',
    interval: null
  };
  fileMedia: MediaObject;
  showFlag:boolean=false;
  mediaSrc:string='';
  pan:number =0;
  recordTimer:any;
  recordFileName ='hd_recoding.wav';

  robot={};

  mobile:any;
  upass:any;
  robotStauts:number =-1;

  constructor(private modalCtrl: ModalController,
              private nativeService: NativeService,
              private navCtrl: NavController,
              private media: MediaPlugin,
              public menuCtrl:MenuController,
              private storage: Storage,
              private mqtt :RobotMQTT,
              public events :Events,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              public ref:ApplicationRef,public video: VideoService) {

  }

  ionViewDidLoad(){

    // this.mqtt.connectToMqtt('18658862111','670b14728ad9902aecba32e22fa4f6bd');
    this.events.subscribe(EVENTS_ROBOT_SELECTED,(data) =>{
      console.log('*********************subscribe :'+EVENTS_ROBOT_SELECTED+'|'+data);
      this.robotStauts =-1;
      this.events.subscribe(EVENTS_ROBOT_STATUS+data,(data2)=>{
        console.log('*********************subscribe :'+EVENTS_ROBOT_STATUS+data+'|'+data2);
        this.robotStauts=data2;
        console.log('*********************publish :'+EVENTS_ROBOT_STATUS2+data+'|'+data2);
        this.events.publish(EVENTS_ROBOT_STATUS2,this.robotStauts);
      });
    });

  }


  toConfigPage(authFlag){
    this.isHasAuth(authFlag).then( res => {

      if (res==true) {
      this.showFlag = false;
      this.navCtrl.push(MinePage);
    }
    });
  }

  toChartPage(authFlag){
    this.isHasAuth(authFlag).then(res =>{
      if(res == true) {
        this.showFlag = false;
        this.navCtrl.push(ChatPage);
      }
    });

    // this.navCtrl.push(ChatPage);
  }

  private getFilePath() {//获得音频文件保存目录
    return new Promise((resolve) => {

        let directory ='';
      if(this.nativeService.isIos()){
        directory=cordova.file.tempDirectory;
      }else if(this.nativeService.isAndroid()){
        directory=cordova.file.externalRootDirectory;
      }
      // cordova.file.externalRootDirectory;
      const username = 'username';
      const dirName = 'recording_' + username;
      const fileName = username + '_' +Utils.dateFormat(new Date(), 'yyyyMMddhhmmss');
    });

  }

  playRecord(){
    if(this.data.status==1&&this.fileMedia) {
      this.nativeService.showToast('开始播放录音');
      this.fileMedia.play();
    }
  }

  cancelRecord(e){
    this.pan++;

    console.log("=======================cancelRecord======================");
    if(this.data.status==2 && this.pan>3){
      this.nativeService.showToast('取消录音...');
      this.fileMedia.stopRecord();
      this.data.status=1;
      if (this.recordTimer)
        clearTimeout(this.recordTimer);
    }

    // clearTimeout()
    // this.playRecord();
  }

  stopRecord(e) {//停止录音
    console.log("=======================stopRecord======================");

    if(this.data.status==2) {
      this.fileMedia.stopRecord();
      this.data.status=1;
      this.nativeService.showToast('发送录音...');
      this.playRecord();
      this.nativeService.readFileASBase64(cordova.file.applicationStorageDirectory+'tmp/',this.recordFileName)
        .then(base64=>{
          console.log(base64);
        });
      if(this.recordTimer)
        clearTimeout(this.recordTimer);
    }

  }



  startRecord(e) {
    console.log("=======================startRecord======================");
    if (!this.nativeService.isMobile()) {
      this.nativeService.showToast('非手机环境!');
      return;
    }


    if(this.nativeService.isIos()){
      this.mediaSrc=this.recordFileName;
    }else if(this.nativeService.isAndroid()){
      this.mediaSrc=this.recordFileName;
    }
    this.nativeService.showToast('开始录音...');
    const onStatusUpdate = (status) => {this.data.status=2;}
    const onSuccess = () => {this.data.status=1;console.log('Action is successful.');};
    const onError = (error) => {this.data.status=1;console.error('===========error MessAGE======'+error.message);}

      this.fileMedia = this.media.create(this.mediaSrc,
        onStatusUpdate,onSuccess,onError);
    this.fileMedia.startRecord();

    this.recordTimer=setTimeout(()=>{
      if(this.data.status==2){
        this.nativeService.showToast('停止录音...');
        this.fileMedia.stopRecord();
        this.data.status=1;
        this.nativeService.showToast('发送录音...');
        this.fileMedia.play();
        this.nativeService.readFileASBase64(cordova.file.applicationStorageDirectory+'tmp/',this.recordFileName)
          .then(base64=>{
            console.log(base64);
          });
      }
    },60000);
    this.fileMedia;
  }

  openRecordSheet(authFlag){
    this.isHasAuth(authFlag).then(res =>{
      if (res ==true) {
        this.showFlag = !this.showFlag;
      }
    });
  }

  //1-查看 2-控制
  isHasAuth(authFlag){
    return new Promise((resolve,reject) => {
      this.storage.get('robot').then(res => {
        this.robot = JSON.parse(res);
        if(!this.robot){
          this.nativeService.showToast('请选择已绑定的设备!')
          resolve(false);
        }else if (!this.robot['authFlag']) {
          this.nativeService.showToast('请选择已绑定的设备!')
          resolve(false);
        }else if (this.robot['authFlag'] >= authFlag) {
          resolve(true);
        }else{
          this.nativeService.showToast('您所选设备只有查看权限，无法对此功能进行操作!')
          resolve(false);
        }

      }, err => {
        this.nativeService.showToast('请选择已绑定的设备!');
        reject(false);
      });
    });

  }

  openVideoSheet(authFlag) {
    this.isHasAuth(authFlag).then(res => {
      if (res==true) {
        let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: '视频通话',
              handler: () => {
                // console.log('++++++++++++++++++++++++++action sheet tap++++++++++++++++++++++++++');
                this.storage.get('robot').then(res =>{
                  this.robot = JSON.parse(res);
                  // this.robot={"deviceId":"robot1723000003","userId":"18658862111","ownerFlag":1,"authFlag":2,
                  //   "deviceNick":"小黄","deviceAvatar":"","groupName":""};
                  console.log('res: '+this.robot);

                  let modal = this.modalCtrl.create(CallModalPage,{robot:this.robot});
                  modal.present();
                });
                // return false;

              }
            }, {
              text: '语音通话',
              handler: () => {
                console.log('Archive clicked');
              }
            }, {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
      }
    });
  }

  showFilter(){
    this.menuCtrl.open('filterMenu');
  }
}


