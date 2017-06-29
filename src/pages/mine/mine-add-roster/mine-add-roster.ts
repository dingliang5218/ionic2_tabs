import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {NativeService} from "../../../providers/NativeService";
import {BusHttpAPI} from "../../../providers/BusHttpAPI";
import {FormBuilder} from "@angular/forms";
import {Validators} from '../../../providers/Validators'
import {Utils} from "../../../providers/Utils";
import {Helper} from "../../../providers/Helper";
/*
  Generated class for the MineAddRoster page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mine-add-roster',
  templateUrl: 'mine-add-roster.html'
})
export class MineAddRosterPage {
  roserForm:any;
  rosterRoleUser={};

  constructor(private navCtrl: NavController, private navParams: NavParams,private viewCtrl: ViewController,
              private http:BusHttpAPI,private nativeService: NativeService,private formBuilder: FormBuilder,
              private helper:Helper) {
    this.roserForm = this.formBuilder.group({
      mobile:[,[Validators.required,Validators.phone]],
      authFlag:[,[Validators.required]]
    });
    this.rosterRoleUser=this.navParams.get('role');
    console.log('rosterRoleUser:'+this.rosterRoleUser);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MineAddRosterPage');
  }


  addRoser(form){
    console.log(form);

    if(form.mobile!=this.rosterRoleUser['userId']){
      var param={'userId':form.mobile,'deviceId':this.rosterRoleUser['deviceId'],
        'authFlag':Number.parseInt(form.authFlag),'ownerFlag':0,'deviceNick':this.rosterRoleUser['deviceNick'],'deviceAvatar':'',
        'groupName':''};

      this.http.post('',Utils.buildPayLoad(this.rosterRoleUser['userId'] + '@user', 'admin@robot',
        'rosterAdd', '1', param),'rosterAdd').then( res =>{
        if(res ==true){
          this.nativeService.showToast('添加设备成员成功!');
          this.dismiss(form.mobile);
        }
      });
    }else {
      this.nativeService.showToast('不能添加自己为设备成员!');
    }
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }


}
