/**
 * Created by yanxiaojun on 2017/4/13.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class GlobalData {
  public static get selectedRobotName(): string {
    return this._selectedRobotName;
  }

  public static set selectedRobotName(value: string) {
    this._selectedRobotName = value;
  }
  public static get selectedRobotDeviceID(): string {
    return this._selectedRobotDeviceID;
  }

  public static set selectedRobotDeviceID(value: string) {
    this._selectedRobotDeviceID = value;
  }

    private _userId: string;
    private _username: string;
    private static _selectedRobotName:string;
    private static _selectedRobotDeviceID:string;


    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

}
