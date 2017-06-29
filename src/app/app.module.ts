import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {MyApp} from './app.component';
import {TabModule} from "../pages/tabs/tab.module";
import {LoginModule} from '../pages/login/login.module';
import {HomeModule} from '../pages/home/home.module';
import {MineModule} from '../pages/mine/mine.module';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AppVersion} from '@ionic-native/app-version';
import {Camera} from '@ionic-native/camera';
import {Toast} from '@ionic-native/toast';
import {File} from '@ionic-native/file';
import {Transfer} from '@ionic-native/transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {ImagePicker} from '@ionic-native/image-picker';
import {Network} from '@ionic-native/network';

import {NativeService} from "../providers/NativeService";
import {HttpIntercept} from "../providers/HttpIntercept";
import {HttpService} from "../providers/HttpService";
import {FileService} from "../providers/FileService";
import {Helper} from "../providers/Helper";
import {Utils} from "../providers/Utils";
import {TestModule} from "../pages/test/test.module";
import {Http, XHRBackend, RequestOptions,BrowserXhr} from "@angular/http";
import {HttpInterceptHandle} from "../providers/HttpInterceptHandle";
import {MediaPlugin} from "@ionic-native/media";
import {DemoModule} from "../pages/demo/demo.module";
import {GlobalData} from "../providers/GlobalData";
import {StorageService} from "../providers/StorageService";
import {BusHttpAPI} from "../providers/BusHttpAPI";
import {ChatModule} from "../pages/chat/chat.module";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {RobotMQTT} from "../providers/robot-mqtt";
import {RobotMqttHandler} from "../providers/robot-mqtt-handler";
import {VideoService} from "../providers/video";
import {AudioService} from "../providers/audio";
import {NativeAudio} from "@ionic-native/native-audio";
import {ScreenOrientation} from "@ionic-native/screen-orientation";

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, httpInterceptHandle: HttpInterceptHandle) {
  return new HttpIntercept(backend, defaultOptions, httpInterceptHandle);
}

@NgModule({
  declarations: [MyApp],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'ios',//android是'md'
      backButtonText: ''
    }),
    // IonicModule.forRoot(MyApp, {
    //   tabsHideOnSubPages: true,
    //   swipeBackEnabled: false,
    //   iconMode: 'ios',
    //   platforms: {
    //     ios: {
    //       backButtonText: "返回"
    //     },
    //     android: {
    //       activator: 'none'
    //     }
    //   }
    // }),
    IonicStorageModule.forRoot(),
    TabModule,
    LoginModule,
    HomeModule,
    DemoModule,
    MineModule,
    ChatModule,
    TestModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    ScreenOrientation,
    NativeAudio,
    Toast,
    File,
    Transfer,
    InAppBrowser,
    ImagePicker,
    Network,
    MediaPlugin,
    HttpInterceptHandle,BrowserXhr,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, HttpInterceptHandle]},
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData,
    StorageService,
    BarcodeScanner,
    RobotMQTT,
    RobotMqttHandler,
    VideoService,
    AudioService,
    BusHttpAPI,
  ]
})
export class AppModule {
}
