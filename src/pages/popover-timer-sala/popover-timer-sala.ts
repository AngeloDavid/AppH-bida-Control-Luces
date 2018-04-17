 import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PopoverTimerSalaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-popover-timer-sala',
  templateUrl: 'popover-timer-sala.html',
})
export class PopoverTimerSalaPage {

  event={
    id:0,
    timestart:'00:00:15',
    min:0,
    seg:0,
    segs:0,
    des:false,
    startTimer:true
  };


  constructor(public navCtrl: NavController, public navParams: NavParams,
        public events:Events,public storage: Storage) {
    this.event.id=this.navParams.get('idPage');
    console.log(this.event.id);
    console.log(storage.keys());

    this.events.subscribe('timerCount'+this.event.id,(tc)=>{
      console.log(tc);
      this.event.timestart=tc;
    });
    this.events.subscribe('startBool'+this.event.id,(sb)=>{
      console.log(sb);
      this.event.startTimer=sb;
    });
    storage.get('startBool'+this.event.id).then(resp=>{
      console.log('respStrp',resp);
      this.event.startTimer=resp;
    });

  }



  ionViewDidLoad(){
    console.log('ionViewDidLoad PopoverTimerSalaPage');
  }


  start(){
    this.event.startTimer=false;
    let horaarray= this.event.timestart.split(":");
    this.event.min=  parseInt(horaarray[1]);
    this.event.seg=  parseInt(horaarray[2]);
    this.event.min=60*this.event.min;
    this.event.segs=this.event.min+this.event.seg;
    console.log(this.event.segs);
    this.events.publish('segse'+this.event.id,this.event.segs);
    this.storage.set('des'+this.event.id,this.event.des);
    this.events.publish('startBool'+this.event.id,this.event.startTimer);


  }

  cerrar(){
    /*this.storage.get('timerCtrl').then((val)=>{
      clearTimeout(val);
    });
    this.storage.remove('timerCtrl');*/

    this.event.startTimer=true;
    this.events.publish('startBool'+this.event.id,this.event.startTimer);
    /*this.events.subscribe('TimerCtrl',(tc)=>{
      console.log(tc);
      clearTimeout(tc);
    })*/
  }


}
