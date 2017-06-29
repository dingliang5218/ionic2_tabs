import {UserInfo} from "../model/UserInfo";
/**
 * Created by lding on 2017/4/25.
 */

export class AppConfig{

  private static user={};
  private static token='';
  private static pass='';
  private static mobile='';

  public static getMobile():string{
    return this.mobile;
  }

  public static setMobile(mobile:string){
    this.mobile=mobile;
  }

  public static getUserInfo():{}{
    return this.user;
  }

  public static setUserInfo(userInfo:{}){
    this.user=userInfo;
  }

  public static getToken():string{
    return this.token;
  }

  public static setToken(token:string){
    this.token=token;
  }

  public static getPass():string{
    return this.pass;
  }

  public static setPass(pass:string){
    this.pass = pass;
  }


}
