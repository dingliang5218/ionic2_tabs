import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import {FormBuilder} from '@angular/forms';
import {ModalController, NavParams,NavController} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';
import {UserInfo} from "../../../model/UserInfo";
import {Validators} from "../../../providers/Validators";
import {MineEditAvatarModalPage} from "../mine-edit-avatar-modal/mine-edit-avatar-modal";
import {DomSanitizer} from "@angular/platform-browser";
import {Utils} from "../../../providers/Utils";
import {BusHttpAPI} from "../../../providers/BusHttpAPI";
import {Helper} from "../../../providers/Helper";

@Component({
  selector: 'page-mine-edit-modal',
  templateUrl: 'mine-edit-modal.html'
})
export class MineEditModalPage {
  userInfo: UserInfo;
  userForm: any;
  avatarPath:any;
  callback:any;
  verifyMessages = {
    'username': {
      'errorMsg': '',
      'required': '手机号码为必填项',
      'username': '请输入正确的手机号码'
    },
    'nick':{
      'errorMsg': '',
      'required': '昵称为必填项',
      'maxlength': '昵称最多6个字符'
    },
    'email': {
      'errorMsg': '',
      'required': '电子邮箱为必填项',
      'email': '请输入正确的邮箱地址'
    }
  };

  constructor(public navCtrl: NavController,
              private params: NavParams,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private nativeService: NativeService,
              private modalCtrl: ModalController,
              private _DomSanitizationService:DomSanitizer,
              private http:BusHttpAPI,
              private helper:Helper
              ) {
    this.userInfo = params.get('userInfo');
    this.callback = params.get('avatarCallback');
    // this.userInfo = params.data;
    this.avatarPath = Utils.converAvartarToBase64(this.userInfo.avatar);
    this.userForm = this.formBuilder.group({
      // mobile: [this.userInfo.mobile, [Validators.required, Validators.phone]],
      mobile: ['18658862110', [Validators.required, Validators.phone]],
      name: [this.userInfo.name, [Validators.required, Validators.maxLength(4)]],
      nick: [this.userInfo.nick, [Validators.required, Validators.maxLength(6)]],
      email: [this.userInfo.email, [Validators.required, Validators.email]]
    });
    this.userForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.verifyMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.userForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
      });
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      if(data && data.avatarPath) {
        data && (this.userInfo.avatar = data.avatarPath);
        this.avatarPath = data.avatarPath
      }
    });
  }

  onSubmit(user) {

    var param={'nick':user.nick,'email':user.email,'name':user.name,'avatar':this.avatarPath};
    // this.nativeService.presentAlert(JSON.stringify(param));

    this.http.post('', Utils.buildPayLoad(this.userInfo.mobile + '@user', 'admin@robot', 'userUpdate', '1', param), 'userUpdate')
      .then(res => {
        console.log('res bool:'+(res ==true));
        console.log('res string:'+(res =='true'));
        console.log('res:'+JSON.stringify(res));
        if (res == true) {
          // this.callback(this.avatarPath).then(res => {
            Object.assign(this.userInfo, this.userForm.value);
            this.userInfo.avatar = this.avatarPath;
            this.storage.set('UserInfo', JSON.stringify(this.userInfo));
            // this.nativeService.showToast(JSON.stringify(this.userInfo));
            this.nativeService.showToast('保存用户信息成功');
            this.navCtrl.pop();
          }
          // ,(err)=>{
          //   console.log('err:'+err)
          // });
         else {
          this.nativeService.showToast('修改用户信息失败！');
        }
      });

  }

}
