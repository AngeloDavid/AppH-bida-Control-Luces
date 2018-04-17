import { Component } from '@angular/core';
import { NavController, NavParams,ToastController
        ,Events,PopoverController  } from 'ionic-angular';
import { LucesCtrlProvider} from '../../providers/luces-ctrl/luces-ctrl';
import {Luces} from '../../interfaces/luces.interfaces';
import {PopoverTimerPage} from '../index.pages';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  listPage:Luces[]=[];
  timer:boolean=false;
  timerBotton:boolean=true;
  timerCount:string='';
  timerCtrl;
  segs:number=0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private  lucesCtrlProv: LucesCtrlProvider,
              public toastCtrl: ToastController,
              public popoverCtrl: PopoverController,
              public events:Events,
              public storage: Storage
  ) {
    this.CargaLuces();
    this.events.publish('msg',0);
    this.events.subscribe('timerCount',(tc)=>{
      this.timerCount=tc;
    });
    this.events.subscribe('segse',(segs)=>{
      console.log(segs);
      this.segs=segs;
    });
    this.events.subscribe('startBool',(sb)=>{
      storage.set('startBool',sb);
      if(sb){

        console.log('startbool',sb);
        clearTimeout(this.timerCtrl);
        console.log('tct',this.timerCtrl);
      } else
      {
        this.timerCtrl =setInterval(()=>{this.okTimer();}, 1000);
      }
    });
  }

  CargaLuces(){
    this.listPage=[];
    for( let data of this.navParams.data){
      this.listPage.push(data);
    }
    for(let luce of this.listPage){
       this.cargarLsitas(luce);
    }
  }

  cargarLsitas(luces:Luces){
    this.lucesCtrlProv.comprobar(luces.ipluces).subscribe(
    //this.lucesCtrlProv.comprobarPr(luces.ipluces,luces.id).subscribe(
      resp=>{
        let parser = new DOMParser();
        let xmlData = parser.parseFromString(resp, "application/xml");
        let xmlArray=  xmlData.getElementsByTagName("LUZ");
        for(let i=0;i<xmlArray.length;i++){
          luces.idLuces[i].disp=false;
          if(xmlArray[i].childNodes[0].nodeValue=='1'){
            luces.idLuces[i].estado=true;
          }else {
            luces.idLuces[i].estado = false;
          }
        };
        this.events.publish('msg',2);
      },
      err=>{
        this.mostrarMsg("Error de Conexion disp:"+luces.descp);
        this.events.publish('msg',2);
        for(let luce of luces.idLuces){
         luce.disp=true;
         luce.estado=false;
        }
      }
    );
  }

  verificarIp(refresher){
    const promise = new Promise((resp,reject)=>{
      this.CargaLuces();
      this.events.subscribe('msg',(msg)=>{
        console.log(msg);
        if(msg==2){
         resp(123);
         this.events.publish('msg',1)
        }
      });

      console.log('promise');
      //resp(123);

    });
    promise.then(
      (resp)=>{
        console.log('refreses',resp);
        refresher.complete();
      }
    );
  }

  prender(luc:Luces,i:number){
    console.log("prender",luc);
    let luces= luc.idLuces[i];
    if(!luces.disp){
      if(luces.estado){
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
      luces.estado=!luces.estado;
    }

  }

  mostrarMsg(msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000 ,
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  mostarTimer(){
    console.log(this.listPage);
    let popover = this.popoverCtrl.create(PopoverTimerPage,{data:this.listPage});
    popover.present();

  }

  verificarTimer(){
    let tip=0;
    for(let pag of this.listPage){
        for(let luce of pag.idLuces){
          if(luce.temp){
            tip++;
          }
        }
    }
    if(tip==0)
      this.timerBotton =true;
    else
      this.timerBotton= false;

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
      clearTimeout(this.timerCtrl);
      for(let luz of this.listPage){
        for (let lindex in luz.idLuces){
          if(luz.idLuces[lindex].temp &&!luz.idLuces[lindex].disp){
            this.storage.get('des').then(des=>{
              this.prenderTC(luz, parseInt(lindex),des);
            });
          }
        }
      }
      this.events.publish('startBool',true);

    }else {
      this.segs--;
    }
    this.events.publish('timerCount',this.segMim(this.segs));
  }

  prenderTC(luc:Luces,i:number, desi:boolean){

    let luces= luc.idLuces[i];
    console.log("prender",luces);
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
