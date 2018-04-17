import { Component } from '@angular/core';
import { NavController, NavParams,Events,ViewController } from 'ionic-angular';
import {Luces} from '../../interfaces/luces.interfaces';
import {LucesCtrlProvider} from '../../providers/luces-ctrl/luces-ctrl';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PopoverTimerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-popover-timer',
  templateUrl: 'popover-timer.html',
})
export class PopoverTimerPage {


  List:Luces[]=[];
  t;
  event = {
    timeStarts: '00:00:15',
  };
  min=0;
  seg=0;
  segs=0;
  des:boolean=false;
  startTimer:boolean=true;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private  lucesCtrlProv: LucesCtrlProvider,public events:Events,
              private viewCtrl :ViewController,public storage: Storage) {
    this.List=this.navParams.get('data');

    this.events.subscribe('timerCount',(tc)=>{
      console.log(tc);
      this.event.timeStarts=tc;
    });
    this.events.subscribe('startBool',(sb)=>{
        console.log(sb);
       this.startTimer=sb;
    });
    storage.get('startBool').then(resp=>{
      console.log('respStrp',resp);
      this.startTimer=resp;
    });
   }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverTimerPage');
  }

  start(){
    this.startTimer=false;
    let horaarray= this.event.timeStarts.split(":");
    this.min=  parseInt(horaarray[1]);
    this.seg=  parseInt(horaarray[2]);
    this.min=60*this.min;
    this.segs=this.min+this.seg;
    console.log(this.segs);
    this.events.publish('segse',this.segs);
    this.storage.set('des',this.des);
    this.events.publish('startBool',this.startTimer);


  }

  aumentarZero(i:number){
    if(i<10){
       return `0${i}`;
    } else {
      return  `${i}`;
    }
  }
  segMim(segu:number){
    let min= Math.floor(segu/60);
    let seg=segu % 60;
    return `00:${this.aumentarZero(min)}:${this.aumentarZero(seg)}`
  }


  okTimer(){
    if(this.segs<=0){
      clearTimeout(this.t);
      for(let luz of this.List){
        for (let lindex in luz.idLuces){
          if(luz.idLuces[lindex].temp &&!luz.idLuces[lindex].disp)
            this.prender(luz, parseInt(lindex),this.des);
          console.log(lindex,this.des);
        }
      }
      this.cerrar();
    } else {
      this.segs--;
      this.event.timeStarts=this.segMim(this.segs);
    }
    this.events.publish('timerCount',this.event.timeStarts);
    this.events.subscribe('startBool',(sb)=>{
       if(sb){
         clearTimeout(this.t);
         this.cerrar();
       }
    });
  }

  cerrar(){
    /*this.storage.get('timerCtrl').then((val)=>{
      clearTimeout(val);
    });
    this.storage.remove('timerCtrl');*/

    this.startTimer=true;
    this.events.publish('startBool',this.startTimer);
    /*this.events.subscribe('TimerCtrl',(tc)=>{
      console.log(tc);
      clearTimeout(tc);
    })*/
  }

  prender(luc:Luces,i:number, desi:boolean){
    console.log("prender",luc);
    let luces= luc.idLuces[i];
    if(!luces.disp){
      if(!desi){
        this.lucesCtrlProv.prender(luc.ipluces,'off',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );
      } else {
        this.lucesCtrlProv.prender(luc.ipluces,'on',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );

      }
      luces.estado=desi;
    }

  }
}
