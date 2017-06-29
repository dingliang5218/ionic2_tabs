import {Component, Input} from '@angular/core';
import {NavController, ActionSheetController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import { PhotoViewer } from '@ionic-native/photo-viewer';
/*
  Generated class for the SelectPic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-select-pic',
  templateUrl: 'select-pic.html',
  providers: [PhotoViewer]
})
export class SelectPicPage {
  imagePaths: string[] = [];
  @Input()
  max: number = 3;  //最多可选择多少张图片，默认为3张

  constructor(public navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private nativeService: NativeService,
              private photoViewer: PhotoViewer
  ) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SelectPicPage');
  }

  addPicture() {
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '相册',
          handler: () => {
            that.nativeService.getMultiplePicture({//从相册多选
              maximumImagesCount: ( that.max - that.imagePaths.length),destinationType: 1
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
            that.nativeService.getPictureByCamera({}, 1).then(imgBase64 => {
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
    this.imagePaths.push(imageBase64s);
  }

  showPictures(imagePath) {
    this.photoViewer.show(imagePath);
  }

  deletePic(i) {
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '删除',
          handler: () => {
            that.imagePaths.splice(i, 1);
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }
}
