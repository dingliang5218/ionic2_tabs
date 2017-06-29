/**
 * Created by lding on 2017/4/25.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() {}

  set(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  get<T>(key: string): Promise<any> {
    let value: string = localStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return <any>JSON.parse(value);
    }

    return null;
  }
}
