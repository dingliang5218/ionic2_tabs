import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {Platform, NavController, ModalController, AlertController, Events} from 'ionic-angular';
import {MineEditAvatarModalPage} from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import {Helper} from "../../providers/Helper";
import {DEFAULT_AVATAR, EVENTS_ROBOT_STATUS, EVENTS_ROBOT_STATUS2} from "../../providers/Constants";
import {AboutPage} from "./about/about";
import {NativeService} from "../../providers/NativeService";
import {SuperPage} from "../common/SuperPage";
import {MineEditModalPage} from "./mine-edit-modal/mine-edit-modal";
import {DomSanitizer} from "@angular/platform-browser";
import {Utils} from "../../providers/Utils";
import {MineEditDeviceNamePage} from "./mine-edit-device-name/mine-edit-device-name";
import {BusHttpAPI} from "../../providers/BusHttpAPI";
import {MineAddRosterPage} from "./mine-add-roster/mine-add-roster";
import {RobotMQTT} from "../../providers/robot-mqtt";


@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
export class MinePage extends SuperPage{
  avatarPath: string = DEFAULT_AVATAR;
  isIos: boolean;
  // userInfo ={};

  rosterRoleUser={};
  rosterListOfDevice =[];
  rosterListOfUsers=[];
  robotStauts:number =-1;

  constructor(public  http:BusHttpAPI,
              public navCtrl: NavController,
              public platform: Platform,
              public nativeService: NativeService,
              public storage: Storage,
              public modalCtrl: ModalController,
              public helper: Helper,
              public alertCtrl: AlertController,
              public mqtt :RobotMQTT,
              public events :Events,
              public _DomSanitizationService:DomSanitizer ) {
    super(storage,helper);
    this.storage.get('robot').then( res => {
      this.rosterRoleUser = JSON.parse(res);
      console.log(this.rosterRoleUser);

      if (this.rosterRoleUser['ownerFlag'] == 1){
        this.http.post('', Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot', 'rosterListOfDevice',
          '1', {'deviceId': this.rosterRoleUser['deviceId']}), 'rosterListOfDevice').then((res: any) => {
          this.rosterListOfDevice = res;
          var mobiles = [];
          for (let i = 0; i < this.rosterListOfDevice.length; i++) {
            mobiles.push(this.rosterListOfDevice[i]['userId']);
          }
          console.log(mobiles);
          this.http.post('', Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot', 'userSummary',
            '1', {'mobiles': mobiles}), 'userSummary').then((res: any) => {
            console.log('***************************userSummary****************' + JSON.stringify(res));
            this.rosterListOfUsers = res;
            for (let i = 0; i < this.rosterListOfUsers.length; i++) {
              this.rosterListOfDevice[i]['avatar'] = this.rosterListOfUsers[i]['avatar'];
            }
          });
          console.log(this.rosterListOfDevice);
        });
    }
    });
    this.isIos = this.nativeService.isIos();
  }

  ionViewDidLoad(){
    this.events.subscribe(EVENTS_ROBOT_STATUS2,(data)=>{
      this.robotStauts=data;
    })
  }


   initPage() {
    //加载用户头像
    this.helper.getUserAvatar().then(avatarPath => {
      this.avatarPath = <string>avatarPath;
    });
  }

  addPerson(){
    let modal = this.modalCtrl.create(MineAddRosterPage, {role: this.rosterRoleUser});
    modal.present();
    modal.onDidDismiss(data => {

      console.log('mobile:' + data);
      if (data) {
        this.http.post('', Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot', 'userSummary',
          '1', {'mobiles': [data]}), 'userSummary').then((res: any) => {
          this.rosterListOfUsers = res;
          this.rosterListOfDevice.push({
            'deviceId': this.rosterRoleUser['deviceId'], 'userId': data, 'ownerFlag': 0,
            'authFlag': 2, 'deviceNick': this.rosterRoleUser['deviceNick'], 'deviceAvatar': '', 'groupName': '',
            'avatar': this.rosterListOfUsers[0]['avatar']
          });


        });
      }
    });
  }

  removePerson(item){
    this.alertCtrl.create({
      title: '确认解除'+item.userId+'授权？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            var param={'userId':item.userId,'deviceId':item.deviceId};
            this.http.post('',Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot',
              'rosterRemove', '1', param),'rosterRemove').then( res =>{
                if(res==true){
                  let index = this.rosterListOfDevice.indexOf(item);
                  this.rosterListOfDevice.splice(index,1);
                  console.log('index:'+index);
                  console.log('rosterListOfDevice:'+JSON.stringify(this.rosterListOfDevice));

                  this.nativeService.showToast('解除授权成功!')
                }else{
                  this.nativeService.showToast('解除授权失败!')
                }
            });
          }
        }
      ]
    }).present();
  }

  edit() {
    // this.navCtrl.push(MineEditPage, this.userInfo);
    this.navCtrl.push(MineEditModalPage, this.userInfo);

    // let modal = this.modalCtrl.create(MineEditModalPage, {'UserInfo':this.userInfo});
    // modal.present();
    // modal.onDidDismiss(userInfo => {
    //   userInfo && (this.userInfo = userInfo)
    // });
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarBase64)
    });
  }

  setDeviceNick(role){
    let modal = this.modalCtrl.create(MineEditDeviceNamePage, {role: role});
    modal.present();
    modal.onDidDismiss(data => {
      if(data){
        this.rosterRoleUser = data;
        console.log(this.rosterRoleUser);
      }
    });
  }



  about() {
    this.navCtrl.push(AboutPage);
  }
}
