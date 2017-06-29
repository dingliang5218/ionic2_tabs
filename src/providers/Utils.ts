/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {Md5} from "ts-md5/dist/md5";
import {DateTime} from "ionic-angular";
import {
  ERROR_MESSAGE01, ERROR_MESSAGE02, ERROR_MESSAGE03, ERROR_MESSAGE04, ERROR_MESSAGE05,
  ERROR_MESSAGE06, ERROR_MESSAGE07, ERROR_MESSAGE08, ERROR_MESSAGE09
} from "./Constants";

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

  constructor() {
  }

  static isEmpty(value): boolean {
    return value == null || typeof value === 'string' && value.length === 0;
  }

  static isNotEmpty(value): boolean {
    return !Utils.isEmpty(value);
  }

  /**
   * 格式“是”or“否”
   * @param value
   * @returns {string|string}
   */
  static formatYesOrNo(value: number|string): string {
    return value == 1 ? '是' : (value == '0' ? '否' : null);
  }


  /**
   * 格式化日期
   * sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')   "09:24"
   * @param date 日期
   * @param sFormat 格式化后的日期字符串
   * @returns {String}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  getSequence = (function () {
    let sequence = 100;
    return function () {
      return ++sequence;
    };
  })();

  static getAPIMD5( pass:string){

    var date = new Date();
    var t =date.getTime() ;

    return Md5.hashStr(t+pass)+'|'+t;
  }

  static getStrMD5(str:string){
    return Md5.hashStr(str);
  }

  static getPayLoadID(){
    return new Date().getTime();
  }

  static buildPayLoad(from,to,act,type,body){
    var payLoad={
      'id':new Date().getTime().toString(),
      'from': from,
      'to': to,
      'act':act,
      'type':type,
      'body':body
    };
    console.log('payLoad:'+JSON.stringify(payLoad));
    return payLoad;
  }

  static converTOPersentMsg(errormsg:string,act?:string){
    if(errormsg==ERROR_MESSAGE01)
      return '用户已存在!';
    if(errormsg == ERROR_MESSAGE02)
      return '无效验证码!';
    if(errormsg == ERROR_MESSAGE03)
      return '无效请求!';
    if(errormsg == ERROR_MESSAGE04)
      return '请先登录!';
    if(errormsg == ERROR_MESSAGE05)
      return '内部错误，请联系管理员!';
    if(errormsg == ERROR_MESSAGE06) {
      if(act=='rosterListOfDevice'){
        return '未经授权，不能获取该设备的授权用户列表!'
      }else if(act=='userLogin'){
        return '未经授权，请确保输入手机号码已经存在!'
      }
      return '未经授权!';
    }
    if(errormsg == ERROR_MESSAGE07)
      return  '输入参数名称错误!';
    if(errormsg == ERROR_MESSAGE08)
      return  '访问资源不存在!';
    if(errormsg == ERROR_MESSAGE09)
      return  '用户不存在!';

    return errormsg;
  }

  static converAvartarToBase64(base64:string){
    // return 'data:image/png;base64,'+base64;
    return base64;
  }

  static robotRoleGroup(arr){



  }



}
