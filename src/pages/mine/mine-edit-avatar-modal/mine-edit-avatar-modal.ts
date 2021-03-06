import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavParams, ViewController} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';
import {UserInfo} from "../../../model/UserInfo";
import {DomSanitizer} from "@angular/platform-browser";
import {AVATAR_PHOTO_SIZE_LIMIT} from "../../../providers/Constants";

@Component({
  selector: 'page-mine-edit-avatar-modal',
  templateUrl: 'mine-edit-avatar-modal.html'
})
export class MineEditAvatarModalPage {
  isChange: boolean = false;//头像是否改变标识
  avatarPath: string;
  // imageBase64: string;
  userInfo: UserInfo = new UserInfo();

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private nativeService: NativeService,
              private storage: Storage,
              private _DomSanitizationService:DomSanitizer
        ) {
    this.avatarPath = this.params.get('avatarPath');
    // console.log('mine-edit-avatar1:|'+this.params.get('avatarPath'));
    this.storage.get('UserInfo').then(userInfo => {
      this.userInfo =JSON.parse(userInfo);
    });
  }

  getPicture(type) {//1拍照,0从图库选择
    let options = {
      targetWidth: 400,
      targetHeight: 400
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options,0).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }
  }



  private getBase64Size(base64){

    let index = base64.indexOf('=');
    if(index >0){
      base64 = base64.replace('=');
    }
    let length = base64.length;
    let fileLength = ((length-length/8*2)/1024)/1024;
    // this.nativeService.showToast('文件大小：'+fileLength);
    if(fileLength>AVATAR_PHOTO_SIZE_LIMIT){
      this.nativeService.showToast('请上传2M以下的图片!')
      return false;
    }
    return true;

  }



  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    if (this.getBase64Size(imageBase64)){
      this.avatarPath = 'data:image/png;base64,' + <string>imageBase64;
    }
    // this.imageBase64 = <string>imageBase64;

    // console.log('imageBase64:||'+imageBase64);

    // console.log('avatarPath:||'+this.avatarPath);
    // this.avatarBase64 = imageBase64;
  }

  saveAvatar() {
    if (this.isChange) {
      this.viewCtrl.dismiss({avatarPath: this.avatarPath});
    } else {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
