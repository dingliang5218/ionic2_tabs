import {ApplicationRef, Component} from '@angular/core';
import {Events, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {
  EVENTS_USER_PUBLISH, EVENTS_USER_WEBRTC_ACCEPT, EVENTS_USER_WEBRTC_ANSWER, EVENTS_USER_WEBRTC_CANCEL,
  EVENTS_USER_WEBRTC_CANDIDATE,
  EVENTS_USER_WEBRTC_INIT,
  EVENTS_USER_WEBRTC_OFFER,
  EVENTS_USER_WEBRTC_REJECT
} from "../../../providers/Constants";
import {Utils} from "../../../providers/Utils";
import {RobotMQTT} from "../../../providers/robot-mqtt";
import {VideoService} from "../../../providers/video";
import {AudioService} from "../../../providers/audio";
import {DomSanitizer} from "@angular/platform-browser";
import set = Reflect.set;

declare var
  cordova: any,
  window: any,
  RTCSessionDescription: any,
  RTCPeerConnection: any,
  RTCIceCandidate: any;


/*
 Generated class for the CallModal page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-call-modal',
  templateUrl: 'call-modal.html'
})
export class CallModalPage {


  //   {
  //     'deviceId':'40161701000002','userId':'18658862111','deviceNick':'slave1',
  //     'deviceAvatar':'','authFlag':1,'ownerFlag':0,'groupName':''}

  robot = {};
  status = 'calling';
  title = '';
  titleSubscription: any;
  dotaNumber = 0;
  pickupSubscription: any;


  maxTimer = 60000;
  facing = 'front';
  pickupTimeout = null;
  contact = null;
  isInCall = false;
  isCalling = false;
  isAnswering = false;
  //duplicateMessages
  muted = false;
  lastState = null;
  localStream = null;
  peerConnection = null;
  remoteVideo = null;
  localVideo = null;
  peerConnectionConfig = null;
  modalShowing = false;
  modal = null;

  answerFlag = false;
  candinateList = [];
  endFlag = true;

  isAudioPlay = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public events: Events, public mqtt: RobotMQTT, public platform: Platform,
              public ref: ApplicationRef, public video: VideoService, public audio: AudioService,
              public sanitizer: DomSanitizer) {

    this.peerConnectionConfig = {
      'iceServers': [{
        "url": 'stun:139.196.26.94:9999'
      }]
    };

    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    this.robot = this.navParams.get('robot');
    console.log('*********************call-modal robot: ' + this.robot);
    // this.title=this.robot['deviceNick']+'呼叫中...';
    this.title = '呼叫中';
    // this.accept();

    this.callPublish();
    this.acceptSubscribe();
    this.rejectSubscribe();
    this.cancelSubscribe();
    this.offerSubscribe();
    this.candidateSubscribe();
  }


  changeTitle() {

    this.titleSubscription = Observable.timer(1000, 1000).subscribe(() => {
      if (this.status == 'calling') {
        this.dotaNumber++;
        if (this.dotaNumber == 1)
          this.title = '呼叫中.  ';
        if (this.dotaNumber == 2)
          this.title = '呼叫中.. ';
        if (this.dotaNumber == 3) {
          this.title = '呼叫中...';
          this.dotaNumber = 0;
        }
      }
      if (this.status == 'initing') {
        this.dotaNumber++;
        if (this.dotaNumber == 1)
          this.title = '建立连接中.  ';
        if (this.dotaNumber == 2)
          this.title = '建立连接中.. ';
        if (this.dotaNumber == 3) {
          this.title = '建立连接中...';
          this.dotaNumber = 0;
        }
      }
    });
  }


  accept() {   //dingliang: 被叫方
    return new Promise((resolve, reject) => {
      if (this.isInCall) {
        resolve();
      }

      this.call(false, this.robot['userId']).then(() => {
        // clearTimeout(this.pickupTimeout);
        // this.pickupTimeout = null;
        this.clearPickUpTimeout();

        this.isInCall = true;
        this.isAnswering = false;
        resolve();
      });
    });

    // setTimeout(() => {
    //   this.socket.emit('sendMessage', this.contact.id, {
    //     type: 'accept'
    //   });
    // });
    // this.refreshVideos();
  }

  gotIceConnectionStateChange(event) {
    if (this.peerConnection) {
      this.lastState = this.peerConnection.iceConnectionState;
      console.log(this.lastState === 'failed' || this.lastState === 'disconnected' || this.lastState === 'closed');
      if (this.lastState === 'failed' || this.lastState === 'disconnected' || this.lastState === 'closed') {
        setTimeout(() => {
          this.title = '通讯中断...'
          this.end();
        }, 2000);
      }
    }
  }


  // begin a call using webrtc
  call(isInitiator, contactId) {//dingliang: create offer
    console.log('calling ' + contactId + ', isInitiator: ' + isInitiator);

    return new Promise((resolve, reject) => {
      var connect = () => {
        this.peerConnection = new (<any>window).RTCPeerConnection(this.peerConnectionConfig);

        this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
        this.peerConnection.onaddstream = this.gotRemoteStream.bind(this);
        this.peerConnection.oniceconnectionstatechange = this.gotIceConnectionStateChange.bind(this);
        this.peerConnection.addStream(this.localStream);

        if (isInitiator) { //dingliang: true----主叫方robot
          //this.isCalling = true;
          console.debug('creating offer');
          this.peerConnection.createOffer(d => {
            //this.gotDescription.call(this, [d]);
            this.gotDescription(d);
          }, e => {
            console.log('error creating offer', e)
          });
        } else {
          //this.isAnswering = true;
        }
      };


      if (!this.localStream) {
        this.video.connect(true, true, this.facing).then(stream => {
          this.addStream(stream, 1000);
          connect();
          resolve();
        }, err => {
          reject();
        });
      } else {
        connect();
        resolve();
      }
    });
  }


  callPublish() {
    this.mqtt.publish(EVENTS_USER_PUBLISH, JSON.stringify(Utils.buildPayLoad(this.robot['userId'] + '@user', this.robot['deviceId'] + '@device',
      'sessionProcess', 5, {'cmd': 'call', 'name': this.robot['deviceNick']})));
    this.changeTitle();
    this.clearPickUpTimeout();
    this.pickupTimeout = setTimeout(() => {
      this.title = '长时间无应答，呼叫中断...'
      this.end();
    }, this.maxTimer);

    this.isAudioPlay = true;
    var audio = document.querySelector('#ring');
    if (audio != null && (<any>audio).paused) {
      (<any>audio).play();
    }

    // this.call(false, this.robot['userId']).then( ()=>{
    //   // clearTimeout(this.pickupTimeout);
    //   // this.pickupTimeout = null;
    //   this.clearPickUpTimeout();
    //
    //   this.isInCall = true;
    //   this.isAnswering = false;
    // });
  }


  cancelPublish() {
    this.mqtt.publish(EVENTS_USER_PUBLISH, JSON.stringify(Utils.buildPayLoad(this.robot['userId'] + '@user', this.robot['deviceId'] + '@device',
      'sessionProcess', 5, {'cmd': 'cancel'})));
    this.status = 'cancel';

  }

  answerPublish(data) {
    console.log('*******************************answer publish*******************************');
    console.log('data:' + data);

    this.mqtt.publish(EVENTS_USER_PUBLISH, JSON.stringify(Utils.buildPayLoad(this.robot['userId'] + '@user', this.robot['deviceId'] + '@device',
      'sessionProcess', 5, {'cmd': 'answer', 'payload': data}))).then(() => {
      this.answerFlag = true;
      for (let i = 0; i < this.candinateList.length; i++) {
        let cad = this.candinateList[i];
        this.peerConnection.addIceCandidate(new RTCIceCandidate(cad)).then(() => {
            console.log('=============================addIceCandidate successful===========================');
          }, e => {
            console.log('=============================addIceCandidate fail===========================');
            console.log(e);
            console.log(cad);
          }
        );
      }
    });
  }



  candidatePublish(data) {
    this.mqtt.publish(EVENTS_USER_PUBLISH, JSON.stringify(Utils.buildPayLoad(this.robot['userId'] + '@user', this.robot['deviceId'] + '@device',
      'sessionProcess', 5, {'cmd': 'candidate', 'payload': data})));
  }


  acceptSubscribe() {

    this.events.subscribe(EVENTS_USER_WEBRTC_ACCEPT, () => {
      console.log('***************call modal recevie:' + EVENTS_USER_WEBRTC_ACCEPT);

      this.status = 'initing';
      //收到被叫方的reject指令后，发送init指令给被叫方
      this.accept().then(() => {
        this.mqtt.publish(EVENTS_USER_PUBLISH, JSON.stringify(Utils.buildPayLoad(this.robot['userId'] + '@user', this.robot['deviceId'] + '@device',
          'sessionProcess', 5, {'cmd': 'init'})));
      });
      this.clearPickUpTimeout();

      // this.accept()
      // this.refreshVideos();

      this.pickupTimeout = setTimeout(() => {
        this.title = '长时间建立连接失败. 通话中断...'
        console.log('长时间建立连接失败. 通话中断...');
        this.end();
      }, this.maxTimer);

    });
  }

  rejectSubscribe() {
    this.events.subscribe(EVENTS_USER_WEBRTC_REJECT, () => {
      this.clearPickUpTimeout();
      console.log('***************call modal recevie:' + EVENTS_USER_WEBRTC_REJECT);
      this.title = '通话被拒绝...';
      this.status = 'reject';
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.viewCtrl.dismiss();
      }, 5000);
    });
  }


  clearPickUpTimeout() {
    if (this.pickupTimeout)
      clearTimeout(this.pickupTimeout);
    this.pickupTimeout = null;
  }


  candidateSubscribe() {
    this.events.subscribe(EVENTS_USER_WEBRTC_CANDIDATE, (cad: any) => {
      console.log(JSON.stringify(cad));

      if (!this.answerFlag)
        this.candinateList.push(cad);
      else {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=');
        this.peerConnection.addIceCandidate(new RTCIceCandidate(cad)).then(() => {
            console.log('=============================addIceCandidate successful===========================');
          }, e => {
            console.log('=============================addIceCandidate fail===========================');
            console.log(e);
            console.log(cad);
          }
        );
        // answerFlag
      }


    });
  }

  cancelSubscribe() {
    this.events.subscribe(EVENTS_USER_WEBRTC_CANCEL, () => {
      console.log('***************call modal recevie:' + EVENTS_USER_WEBRTC_REJECT);
      this.title = '通话被取消...';
      this.clearPickUpTimeout();
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false

        this.viewCtrl.dismiss();
      }, 5000);
    });
  }

  //offer SDP对象，通过PeerConnection的SetRemoteDescription方法将其保存起来，并调用PeerConnection的CreateAnswer方法创建一个
  // 应答的SDP对象，通过PeerConnection的SetLocalDescription的方法保存该应答SDP对象并将它通过Signal服务器发送给ClientA。
  offerSubscribe() {
    this.events.subscribe(EVENTS_USER_WEBRTC_OFFER, (sdp: any) => {
      // this.accept().then(()=>{
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp), () => {
        this.peerConnection.createAnswer().then((desc: any) => {
          console.log('createAnswer成功');
          this.gotDescription(desc);
        });
      });
      // });
    });
  }


  private gotDescription(description) { //dingliang：create offer -----set SDP to SetLocalDescription, publish to 主叫方
    console.log('got description', description, this.contact);
    this.peerConnection.setLocalDescription(description, () => {
      console.log('***************answer playload*********************' + description);
      this.answerPublish(description);
    }, e => {
      console.log('set description error', e)
    });
  }


  private gotIceCandidate(event) {
    if (event.candidate) {
      this.candidatePublish(event.candidate);
      //发送 candidate到对方
      // this.status = 'initing'
    }
  }


  addStream(stream, timeout = 10000) {
    this.localStream = stream;
    // this.status='speaking';
    //
    // let rvideo = document.querySelector('#localVideo');
    // (<any>rvideo).src =  window.URL.createObjectURL(stream);
    // console.log();
    //
    // // (<any>rvideo).src =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
    // // setTimeout(() => {
    // //   this.localVideo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
    // // }, timeout);
  }


  private gotRemoteStream(event) {
    this.status = 'speaking';
    console.log('got remote stream');
    // this.remoteVideo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.stream));
    // if ((<any>window).device.platform === 'iOS')
    this.refreshVideos();
    this.titleSubscription.unsubscribe();

    setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
      console.log('收到远端流xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', event.stream);
      console.log('收到远端流xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', window.URL.createObjectURL(event.stream));
      //本地视频流
      // let localrvideo = document.querySelector('#localVideo');
      // (<any>localrvideo).src =  window.URL.createObjectURL(this.localStream);
      let miniVideo = document.querySelector('#miniVideo');
      (<any>miniVideo).src = window.URL.createObjectURL(this.localStream);
      //
      let rvideo = document.querySelector('#remoteVideo');
      // (<any>rvideo).src =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(event.stream));
      (<any>rvideo).src = window.URL.createObjectURL(event.stream);

    }, 1500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallModalPage');
  }

  refreshVideos() {
    // tell the modal that we need to revresh the video
    this.ref.tick();

    if (!this.platform.is('cordova')) {
      return;
    }
    try {
      for (var x = 0; x <= 3000; x += 300) {
        // for (var x = 0; x <= 1500; x+=500) {
        console.log(x)
        setTimeout(cordova.plugins.iosrtc.refreshVideos, x);
      }
    } catch (e) {
      console.log(e);
    }
  };

  unSubscribe() {
    this.events.unsubscribe(EVENTS_USER_WEBRTC_ACCEPT);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_REJECT);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_CANCEL);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_INIT);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_OFFER);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_ANSWER);
    this.events.unsubscribe(EVENTS_USER_WEBRTC_CANDIDATE);
  }


  end() {
    if (this.endFlag) {

      if(this.isAudioPlay){
        this.isAudioPlay =false;
        var audio = document.querySelector('#ring');
        (<any>audio).pause();
      }

      this.endFlag = false;
      this.cancelPublish();
      // this.peerConnection.close();
      if (this.peerConnection) {
        this.peerConnection.close();
      }
      this.peerConnection = null;
      if (this.titleSubscription)
        this.titleSubscription.unsubscribe();
      this.clearPickUpTimeout();
      this.unSubscribe();
      this.viewCtrl.dismiss();
    }
  }
}
