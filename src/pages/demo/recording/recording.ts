import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';
import {Utils} from "../../../providers/Utils";
import {NativeService} from "../../../providers/NativeService";
import {RecordingRecordPage} from "./recording-record";
declare var cordova: any;

@Component({
    selector: 'page-recording',
    templateUrl: 'recording.html'
})
export class RecordingPage {

    constructor(public navCtrl: NavController,
                private file: File,
                private nativeService: NativeService,
                private media: MediaPlugin) {
    }

    data = {
        status: 1,//1未录音,2正在录音
        timer: '00:00:00',
        interval: null
    };
    fileMedia: MediaObject;

    private getFilePath() {//获得音频文件保存目录
        return new Promise((resolve) => {
            const directory = cordova.file.externalRootDirectory;
            const username = 'username';
            const dirName = 'recording_' + username;
            const fileName = username + '_' + Utils.dateFormat(new Date(), 'yyyyMMddhhmmss');
            this.file.checkDir(directory, dirName).then(res => {
                resolve(directory + dirName + '/' + fileName + '.mp3');
            }, () => {
                this.file.createDir(directory, dirName, false).then(() => {
                    resolve(directory + dirName + '/' + fileName + '.mp3');
                }, err => {
                    resolve(directory + dirName + '/' + fileName + '.mp3');
                    debugger;
                });
            })
        });

    }

    startRecord() {//开始录音
        if (!this.nativeService.isMobile()) {
            this.nativeService.showToast('非手机环境!');
            return;
        }
        if (this.data.status = 1) {
            this.data.status = 2;
            this.data.interval = setInterval(() => {
                let date = new Date(Utils.dateFormat(new Date()) + ' ' + this.data.timer);
                date.setSeconds(date.getSeconds() + 1);
                this.data.timer = Utils.dateFormat(date, 'hh:mm:ss');
            }, 1000);
            this.getFilePath().then((src: string) => {
                // this.media.create(src)
                    // .then((file: MediaObject) => {
                    //     this.fileMedia = file;
                    //     file.startRecord();
                    // }
                    // );
            });
        } else {
            this.nativeService.showToast('正在录音');
        }
    }

    stopRecord() {//停止录音
        if (this.data.status = 2) {
            this.data.status = 1;
            clearInterval(this.data.interval);
            this.data.timer = '00:00:00';
            this.fileMedia.stopRecord();
            // this.media.release();
        } else {
            this.nativeService.showToast('未开始录音');
        }
    }


    recordingRecord() {//查看录音记录
        if (this.data.status = 1) {
            this.navCtrl.push(RecordingRecordPage);
        } else {
            this.nativeService.showToast('正在录音');
        }
    }
}
