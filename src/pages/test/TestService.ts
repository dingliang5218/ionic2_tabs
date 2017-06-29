import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {TestObj} from "./TestObj";
import {HttpService} from "../../providers/HttpService";

@Injectable()
export class TestService {
  constructor(public httpService: HttpService) {
  }

  getJson() {
    return this.httpService.get('./assets/data/test.json').map((res: Response) => res.json());
  }

  getObj():Observable<TestObj> {
    return this.httpService.get('./assets/data/test.json').map((res: Response) => res.json());
  }

  getList():Observable<TestObj[]> {
    return this.httpService.get('./assets/data/testList.json').map((res: Response) => res.json());
  }

}
