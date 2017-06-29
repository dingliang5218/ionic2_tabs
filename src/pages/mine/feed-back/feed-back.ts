import {Component} from '@angular/core';
import {ActionSheetController, ModalController} from 'ionic-angular';
import {FormBuilder} from '@angular/forms';
import {NativeService} from "../../../providers/NativeService";
import {ShowPicturesPage} from "../show-pictures/show-pictures";
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html'
})
export class FeedBackPage {
  feedBackForm: any;
  imagePaths: string[] = [];

  constructor(private formBuilder: FormBuilder,
              private actionSheetCtrl: ActionSheetController,
              private nativeService: NativeService,
              public modalCtrl: ModalController,) {
    this.feedBackForm = this.formBuilder.group({
      description: [,]// 第一个参数是默认值
    });

  }

  addPicture() {
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '相册',
          handler: () => {
            that.nativeService.getMultiplePicture({//从相册多选
              maximumImagesCount: ( 4 - that.imagePaths.length)
            }).then(imgBase64s => {
              for (let imgBase64 of <string[]>imgBase64s) {
                that.getPictureSuccess(imgBase64);
              }
            });
          }
        },
        {
          text: '拍照',
          handler: () => {
            that.nativeService.getPictureByCamera().then(imgBase64 => {
              that.getPictureSuccess(imgBase64);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  private getPictureSuccess(imageBase64s) {
    let imagePath = 'data:image/jpeg;base64,' + imageBase64s;
    this.imagePaths.push(imagePath);
  }

  showPictures() {
    let modal = this.modalCtrl.create(ShowPicturesPage, {imagePaths: this.imagePaths});
    modal.present();
    modal.onDidDismiss(imagePaths => {
      imagePaths && (this.imagePaths = imagePaths)
    });
  }
}
