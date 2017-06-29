import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import {TabsPage} from "./tabs";


@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [TabsPage],
  entryComponents: [TabsPage],
  providers: [],
  exports: [IonicModule]
})
export class TabModule {
}
