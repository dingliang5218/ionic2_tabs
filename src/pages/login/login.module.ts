import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import {LoginPage} from './login';
import {FindPasswordPage} from './find-password/find-password';
import {RegisterPage} from './register/register';

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  declarations: [LoginPage, FindPasswordPage, RegisterPage],
  entryComponents: [LoginPage, FindPasswordPage, RegisterPage],
  providers: [],
  exports: [IonicModule]
})
export class LoginModule {
}
