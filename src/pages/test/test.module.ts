import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import {TestPage} from "./test";
import {TestService} from "./TestService";
import {Conversion} from "../../pipes/conversion";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  imports: [
    IonicModule.forRoot(MyApp),
    SharedModule
  ],
  declarations: [TestPage, Conversion],
  entryComponents: [TestPage],
  providers: [TestService]
})
export class TestModule {
}
