import {Component} from '@angular/core';
import {ModalController, NavParams} from 'ionic-angular';
import {MineEditModalPage} from '../mine-edit-modal/mine-edit-modal';
import {MineEditAvatarModalPage} from '../mine-edit-avatar-modal/mine-edit-avatar-modal';
import {UserInfo} from "../../../model/UserInfo";
import {DEFAULT_AVATAR} from "../../../providers/Constants";
import {Helper} from "../../../providers/Helper";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'page-mine-edit',
  templateUrl: 'mine-edit.html'
})
export class MineEditPage {
  userInfo: UserInfo;
  avatarPath: string = DEFAULT_AVATAR;


  constructor(private modalCtrl: ModalController,
              private params: NavParams,
              private helper: Helper,
              private _DomSanitizationService:DomSanitizer) {
    this.userInfo = params.data;
    this.helper.getUserAvatar().then(avatarPath => {
      this.avatarPath = <string>avatarPath;
    });
  }

  viewAvatar($event) {
    $event.stopPropagation();
    let modal = this.modalCtrl.create(MineEditAvatarModalPage, {avatarPath: this.avatarPath});
    modal.present();
    modal.onDidDismiss(data => {
      data && (this.avatarPath = data.avatarBase64)
    });
  }

  openModal() {
    let modal = this.modalCtrl.create(MineEditModalPage, {'userInfo':this.userInfo});
    modal.present();
    modal.onDidDismiss(userInfo => {
      userInfo && (this.userInfo = userInfo)
    });
  }

}
