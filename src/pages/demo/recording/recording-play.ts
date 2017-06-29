import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MediaPlugin, MediaObject} from '@ionic-native/media';

@Component({
    selector: 'page-recording-play',
    templateUrl: 'recording-play.html'
})
export class RecordingPlayPage {

    fleEntry;
    file: MediaObject;

    constructor(private navCtrl: NavController, private navParams: NavParams, private media: MediaPlugin) {
        this.fleEntry = navParams.data;
    }

    play() {//播放
        this.media.create('path/to/file.mp3', (status) => console.log(status));
            // .then((file: MediaObject) => {
            //     this.file = file;
            //     file.play();
            //
            // })
            // .catch(e => console.log('Error opening media file', e));

    }

    pause() {//暂停
        this.file.pause();
    }

    stop() {//停止
        this.file.stop();
    }

}
