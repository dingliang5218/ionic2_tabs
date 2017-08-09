import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Paho} from 'ng2-mqtt/mqttws31';
import {EVENTS_ROBOT_STATUS, MQTT_WS_PORT, MQTT_WS_URL} from "./Constants";
import {Events} from "ionic-angular";

/*
  Generated class for the RobotMQTT provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RobotMQTT {

  private userTopic=''
  private mobile='';
  private upass='';

  public robotStatus=0;

  client :any;
  message:any;

  constructor(public events: Events) {
    // this.connectToMqtt();
  }

  // connectToMqtt(){
  //   return new Promise((resolve, reject) => {
  //     this.client = new Paho.MQTT.Client(MQTT_WS_URL, MQTT_WS_PORT, this.mobile + '@user');
  //     this.client.onConnectionLost = this.onConnectionLost;
  //     this.client.onMessageArrived = this.onMessageArrived;
  //     this.client.connect({
  //       onSuccess: this.onConnect.bind(this),
  //       userName: this.mobile,
  //       password: this.upass
  //     });
  //     resolve(true);
  //   });
  // }

  connectToMqtt(usrname,passMD5) {
    this.mobile = usrname;
    this.upass = passMD5;
    this.userTopic = '$IOT/' + this.mobile;
    console.log('**********************************connectToMqtt**************************************');
    console.log('mobile:' + this.mobile + '|upass:' + this.upass + '|userTopic:' + this.userTopic);
    // if (typeof this.client == 'undefined') {

      // this.disConnect();

    this.client = new Paho.MQTT.Client(MQTT_WS_URL, MQTT_WS_PORT, this.mobile + '@user');
      this.client.onConnectionLost = this.onConnectionLost.bind(this);

    this.client.onMessageArrived = this.onMessageArrived.bind(this);
// connect the client
      this.client.connect({
        onSuccess: this.onConnect.bind(this),
        userName: this.mobile,
        password: this.upass
      });


  }
  // }

  onConnect() {
    console.log('*************************onConnect**********************************');
    this.client.subscribe(this.userTopic);
  }

  publish(topic,payload){

    return new Promise((resolve, reject) => {
      console.log('*************************publish**********************************');
      console.log('topic:'+topic+'|payload:'+payload);

      this.message= new Paho.MQTT.Message(payload);
      this.message.destinationName = topic;

      this.client.send(this.message)
        resolve();

    });

  }



  onMessageArrived(message) {
    // console.log("******************************onMessageArrived:"+message.destinationName+' '+message.payloadString);
    let res = JSON.parse(message.payloadString);

    if(res.act=='devicePresence'){
      console.log('设备状态：'+res.body.status);
      this.robotStatus = res.body.status;
      console.log('**********************************publish:'+EVENTS_ROBOT_STATUS+res.body.device_id);

      this.events.publish(EVENTS_ROBOT_STATUS+res.body.device_id,this.robotStatus);
    }
    if(res.act=='sessionProcess'){
      console.log('WEBRTC-MQTT信令通道cmd：'+res.body.cmd);
      this.events.publish(res.body.cmd,res.body.payload);
    }
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("******************************onConnectionLost:"+responseObject.errorMessage);
      if(typeof this.client !='undefined' && this.client.isConnected())
        this.client.disconnect();
      this.connectToMqtt(this.mobile,this.upass);
    }
  }

  disConnect(){
    // if(this.client.isConnected())
    if(typeof this.client !='undefined' && this.client.isConnected()){
      console.log('*************************disConnect******************************');
      this.client.disconnect();
    }
  }

}
