/**
 */
import {Injectable} from '@angular/core';

import {ModalController} from "ionic-angular";
import {LoginPage} from "../pages/login/login";
import {DEFAULT_AVATAR} from "./Constants";
import {FileService} from "./FileService";
import {Storage} from "@ionic/storage";

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {

  constructor(private modalCtrl: ModalController,
              private storage: Storage) {
  }


  /**
   * 打开登录窗口去登录
   * @param callBack
   */
  goLogin(callBack) {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
    modal.onDidDismiss(userInfo => {
      callBack(userInfo);
    });
  }

  /**
   * 根据用户信息获取用户头像
   * @return {string}
   */
  getUserAvatar() {
    return new Promise((resolve) => {
      this.storage.get('UserInfo').then(userInfo => {
        console.log('getUserAvatar.userInfo:'+!userInfo );
        console.log('getUserAvatar.userInfo.avatar:'+!userInfo.avatar );
        if (!userInfo || !userInfo.avatar) {

          resolve(DEFAULT_AVATAR);
        } else {
          resolve(userInfo.avatar);
          // this.storage.get(avatarKey).then(avatarPath => {
          //   if (avatarPath) {
          //     resolve(avatarPath);
          //   } else {
          //     this.fileService.getFileInfoById(avatarBase64).subscribe(result => {
          //       if (result.success) {
          //         this.storage.set(avatarKey, FILE_SERVE_URL + result.data.origPath);
          //         resolve(FILE_SERVE_URL + result.data.origPath);
          //       }
          //     })
          //   }
          // });
        }
      });
    });
  }

  getRangeDate( range: number, type?: string ) {

    const formatDate = ( time: any ) => {
      // 格式化日期，获取今天的日期
      const Dates = new Date( time );
      const year: number = Dates.getFullYear();
      const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + month + '-' + day;
    };

    // const now = formatDate( new Date().getTime() ); // 当前时间
    const resultArr: Array<any> = [];
    let changeDate: string;
    if ( range ) {
      if ( type ) {
        if ( type === 'one' ) {
          changeDate = formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * range ) );
          console.log( changeDate );
        }
        if ( type === 'more' ) {
          if ( range < 0 ) {
            for ( let i = Math.abs( range ); i >= 0; i-- ) {
              resultArr.push( formatDate( new Date().getTime() + ( -1000 * 3600 * 24 * i ) ) );
              console.log( resultArr );
            }
          } else {
            for ( let i = 1; i <= range; i++ ) {
              resultArr.push( formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * i ) ) );
              console.log( resultArr );
            }
          }

        }
      } else {
        changeDate = formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * range ) );
        console.log( changeDate );
      }
    }
    return changeDate;
  }

}
