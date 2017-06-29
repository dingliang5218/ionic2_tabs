import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import {MinePage} from './mine';
import {MineEditPage} from './mine-edit/mine-edit';
import {MineEditModalPage} from './mine-edit-modal/mine-edit-modal';
import {MineEditAvatarModalPage} from './mine-edit-avatar-modal/mine-edit-avatar-modal';
import {FeedBackPage} from "./feed-back/feed-back";
import {AboutPage} from "./about/about";
import {UpdateLogPage} from "./update-log/update-log";
import {ShowPicturesPage} from "./show-pictures/show-pictures";
import {MineEditDeviceNamePage} from "./mine-edit-device-name/mine-edit-device-name";
import {MineAddRosterPage} from "./mine-add-roster/mine-add-roster";


@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [MineAddRosterPage,MineEditDeviceNamePage,MinePage, MineEditPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage],
  entryComponents: [MineAddRosterPage,MineEditDeviceNamePage,MinePage, MineEditPage, MineEditModalPage, MineEditAvatarModalPage, FeedBackPage, AboutPage, UpdateLogPage, ShowPicturesPage],
  providers: [],
  exports: [IonicModule]
})
export class MineModule {
}
