/**
 * Created by lding on 2017/5/2.
 */
import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import {ChatPage} from "./chat";
import {CallModalPage} from "./call-modal/call-modal";

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [ChatPage,CallModalPage],
  entryComponents: [ChatPage,CallModalPage],
  providers: [],
  exports: [IonicModule]
})
export class ChatModule {
}
