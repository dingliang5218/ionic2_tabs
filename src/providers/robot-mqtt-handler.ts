import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Events} from "ionic-angular";
import {NativeService} from "./NativeService";

/*
  Generated class for the RobotMqttHandler provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RobotMqttHandler {

  constructor(public events: Events, public nativeService: NativeService) {
    console.log('Hello RobotMqttHandler Provider');
  }



}
