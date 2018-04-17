import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {SalaPage,TabsmenuPage,PopoverTimerPage,HomePage,PopoverTimerSalaPage} from '../pages/index.pages';
import { LucesCtrlProvider } from '../providers/luces-ctrl/luces-ctrl';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SalaPage,
    TabsmenuPage,
    PopoverTimerPage,
    PopoverTimerSalaPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      cancelText:'Atras',
      doneText:'OK'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SalaPage,
    TabsmenuPage,
    PopoverTimerPage,
    PopoverTimerSalaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LucesCtrlProvider
  ]
})
export class AppModule {}
