import {UserInfo} from "../../model/UserInfo";
import {Helper} from '../../providers/Helper';
import {Storage} from "@ionic/storage";

/**
 * Created by lding on 2017/4/25.
 */

export class SuperPage{

  public userInfo ={};

  constructor( public storage: Storage,
               public helper: Helper){

  }


  ionViewWillEnter() {

    this.storage.get('UserInfo').then(res =>{
      if(res){
        this.userInfo = JSON.parse(res);
        // console.log("typeof robot:"+this.userInfo.robotName);
        this.initPage();
      }else{
        this.helper.goLogin(res2 => {
          this.userInfo = res2;
          this.initPage();
        });
      }
    });
  }

  initPage(){

  }


}
