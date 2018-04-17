import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,Events,PopoverController } from 'ionic-angular';
import { LucesCtrlProvider} from '../../providers/luces-ctrl/luces-ctrl';
import {PopoverTimerSalaPage} from '../index.pages';
import {Luces} from '../../interfaces/luces.interfaces';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the SalaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-sala',
  templateUrl: 'sala.html',
})
export class SalaPage {

  luz:Luces={
    id:0,
    descp:'',
    icon:'',
    ipluces:'',
    idLuces:[{
      id:0,
      title:'',
      disp:true
    }]
  };
  timer:boolean=false;
  timerBotton:boolean=true;
  timerCount:string='';
  timerCtrl;
  segs:number=0;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private  lucesCtrlProv: LucesCtrlProvider,
              public toastCtrl: ToastController,
              public popoverCtrl: PopoverController,
              public events:Events,
              public storage: Storage) {
      this.luz=this.navParams.data;

      this.cargarListLuces();

    this.events.publish('msg',0);
    this.events.subscribe('timerCount'+ this.luz.id,(tc)=>{

      this.timerCount=tc;
    });
    this.events.subscribe('segse'+ this.luz.id,(segs)=>{
      console.log(segs);
      this.segs=segs;
    });
    this.events.subscribe('startBool'+ this.luz.id,(sb)=>{
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalaPage');
  }

  cargarListLuces(){

    this.lucesCtrlProv.comprobar(this.luz.ipluces).subscribe(
      resp=>{

        let parser = new DOMParser();
        let xmlData = parser.parseFromString(resp, "application/xml");
        let xmlArray=  xmlData.getElementsByTagName("LUZ");
        for(let i=0;i<xmlArray.length;i++){
          // console.log(xmlArray[i].childNodes[0].nodeValue);
          this.luz.idLuces[i].disp=false;
          if(xmlArray[i].childNodes[0].nodeValue=='1'){
            this.luz.idLuces[i].estado=true;
          }else {
            this.luz.idLuces[i].estado = false;
          }
        }
        this.events.publish('msg',2);
      },
      err=>{
        this.mostrarMsg("Error de Conexion disp:"+this.luz.descp);
        this.events.publish('msg',2);
        for(let luce of this.luz.idLuces){
          luce.disp=true;
          luce.estado=false;
        }
      }
    );
  }
  okTimer(){
    if(this.segs<=0){
      clearTimeout(this.timerCtrl);
        for (let lindex in this.luz.idLuces){
          if(this.luz.idLuces[lindex].temp &&!this.luz.idLuces[lindex].disp) {
            this.storage.get('des'+this.luz.id).then(des => {
              console.log('variable',des);
              this.prenderTC(parseInt(lindex), des);
            });
          }
      }
      this.events.publish('startBool'+this.luz.id,true);

    }else {
      this.segs--;
    }
    this.events.publish('timerCount'+this.luz.id,this.segMim(this.segs));
  }

  prender(i:any){
    let luces= this.luz.idLuces[i];
    if(!luces.disp){
      if(luces.estado){
        this.lucesCtrlProv.prender(this.luz.ipluces,'off',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );
      } else {
        this.lucesCtrlProv.prender(this.luz.ipluces,'on',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );
      }
      this.luz.idLuces[i].estado=!this.luz.idLuces[i].estado;
    }

  }
  prenderTC(i:number, desi:boolean){

    let luces= this.luz.idLuces[i];
    console.log("prender",luces);
    if(!luces.disp){
      if(!desi){
        this.lucesCtrlProv.prender(this.luz.ipluces,'off',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );
      } else {
        this.lucesCtrlProv.prender(this.luz.ipluces,'on',luces.id+'').subscribe(
          resp=>{
            console.log(resp);
          }
        );
      }
      luces.estado=desi;
    }

  }
  verificarTimer(){
    let tip=0;

      for(let luce of this.luz.idLuces){
        if(luce.temp){
          tip++;
        }
      }

    if(tip==0)
      this.timerBotton =true;
    else
      this.timerBotton= false;

  }

  mostrarMsg(msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000 ,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'middle'
    });
    toast.present();
  }

  mostarTimer(){
    this.storage.set('startBool'+this.luz.id,true);
    console.log(this.storage.keys());
    let popover = this.popoverCtrl.create(PopoverTimerSalaPage,{idPage:this.luz.id});
    popover.present();

  }

  verificarIp(refresher){
    const promise = new Promise((resp,reject)=>{
      this.cargarListLuces();
      this.events.subscribe('msg',(msg)=>{
        console.log(msg);
        if(msg==2){
          resp(123);
          this.events.publish('msg',1)
        }
      });
      console.log('promise');
    });
    promise.then(
      (resp)=>{
        console.log('refreses',resp);
        refresher.complete();
      }
    );
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




}
