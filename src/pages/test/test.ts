import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import {TestService} from "./TestService";
import {NavController} from "ionic-angular";
import {NativeService} from "../../providers/NativeService";

@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {

  constructor(private navCtrl: NavController,
              private nativeService: NativeService,
              public testService: TestService) {

  }

  ionViewDidEnter() {

  }

  click() {
    alert('test');
    /* this.http.post('http://localhost:8081/api/demouser/page', {}).subscribe(res => {
     console.log(res.json());
     });
     this.testService.getObj().subscribe(res => {
     console.log(res);
     });*/
  }


}
