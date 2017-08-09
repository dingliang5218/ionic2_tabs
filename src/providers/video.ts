// manages video elements

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var navigator:any;


@Injectable()
export class VideoService {
	localStream = null
	facing = 'front'

	constructor(public platform: Platform) {
    console.log('获取本地流');
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
    }
    if (!navigator.getUserMedia) {
      console.log('getUserMedia not supported in this browser.');
    }
	}

	connect(audio, video, facing) {
		let self = this;
		console.debug('getting stream', audio, video);
		return new Promise((resolve, reject) => {
			var connect = () => {
				var videoOptions = {
					deviceId: null
				};

				if (this.platform.is('cordova') && this.platform.is('ios')) {
				  console.log('+++++++++++++++++++++++++ios chose camera+++++++++++++++++++++++++');
					if (facing == 'front') {
						videoOptions.deviceId = 'com.apple.avfoundation.avcapturedevice.built-in_video:1';
					} else if (facing == 'back') {
						videoOptions.deviceId = 'com.apple.avfoundation.avcapturedevice.built-in_video:0';
					}
				}
				navigator.getUserMedia({audio:true, video:true}, (stream:any) => {
						console.log('got local MediaStream: ', stream, stream.getTracks());
						this.localStream = stream;
						resolve(stream);
					},
					error => {
						console.error('getUserMedia failed: ', error);
						reject();
					}
				)
			};
			// var getDevices = () => {
			// 	navigator.mediaDevices.enumerateDevices().then(data => {
            //
			// 	});
			// };
			if (this.localStream) {
				self.disconnect().then(connect);
			} else {
				connect();
			}
		});
	}

	// get a list of devices
	// devices() {
	// 	return new Promise((resolve, reject) => {
	// 		navigator.mediaDevices.enumerateDevices().then(devices => {
	// 			resolve(devices);
	// 		});
	// 	});
	// }

	// mute audio
	// @todo: make this reestablish a connection
	mute() {
		return new Promise((resolve, reject) => {
			if (this.localStream) {
				var tracks = this.localStream.getAudioTracks();
				for (var x in tracks) {
					tracks[x].enabled = false;
				}
			}
			resolve(this.localStream);
		});
	}

	// unmute audio
	// @todo: make this reestablish a connection
	unmute() {
		var self = this;
		return new Promise((resolve, reject) => {
			self.connect(true, true, this.facing).then((stream) => {
				resolve(stream);
			});
		});
	}

	// disconnect the media stream
	disconnect() {
		return new Promise((resolve, reject) => {
			if (this.localStream) {
				var tracks = this.localStream.getTracks();
				for (var x in tracks) {
					tracks[x].stop();
				}
				console.debug('stoping stream', this.localStream.getTracks());
				this.localStream = null;
			}
			resolve();
		});
	}
}
