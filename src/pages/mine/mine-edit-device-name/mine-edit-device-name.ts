import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Utils} from "../../../providers/Utils";
import {BusHttpAPI} from "../../../providers/BusHttpAPI";
import {NativeService} from "../../../providers/NativeService";
import {Helper} from "../../../providers/Helper";

/*
  Generated class for the MineEditDeviceName page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mine-edit-device-name',
  templateUrl: 'mine-edit-device-name.html'
})
export class MineEditDeviceNamePage {

  rosterRoleUser={};

  constructor(public navCtrl: NavController,private viewCtrl: ViewController,
              public navParams: NavParams,private http:BusHttpAPI,private nativeService: NativeService
              ,public helper:Helper) {
    this.rosterRoleUser=this.navParams.get('role');
    console.log('rosterRoleUser:'+this.rosterRoleUser);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MineEditDeviceNamePage');
  }

  editDeviceName(){
    console.log(this.rosterRoleUser);
    console.log(this.rosterRoleUser['deviceNick']);

    var param={'userId':this.rosterRoleUser['userId'],'deviceId':this.rosterRoleUser['deviceId'],
    'deviceNick':this.rosterRoleUser['deviceNick'],'deviceAvatar':'','groupName':''};

    this.http.post('',Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot',
      'rosterUpdate', '1', param),'rosterUpdate').then(res =>{
        if(res == true){
          this.nativeService.showToast('设置设备别名成功!');
          this.dismiss();
        }
    })

  }



  dismiss() {
    this.viewCtrl.dismiss();
  }

}
