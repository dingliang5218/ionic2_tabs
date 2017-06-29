import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from "../app/app.component";
import {PaginationPage} from "./pagination-component/pagination";
import {SelectPicPage} from "./select-pic/select-pic";


@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [PaginationPage, SelectPicPage],
  exports: [PaginationPage, SelectPicPage],
  providers: []
})
export class SharedModule {
}
