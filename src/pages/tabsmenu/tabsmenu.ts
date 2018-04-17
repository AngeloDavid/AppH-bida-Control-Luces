import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SalaPage,HomePage} from '../index.pages';
import {Luces} from '../../interfaces/luces.interfaces';

/**
 * Generated class for the TabsmenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabsmenu',
  templateUrl: 'tabsmenu.html',
})
export class TabsmenuPage {

  home:any=HomePage;
  tab1:any=SalaPage;
  homeTab:Luces[]=[
    {
      id:0,
      descp:'Puerta',
      icon:'ios-albums',
      ipluces:'192.168.0.115',
      //ipluces:'localhost:3001/entrada',
      idLuces:[
        {id:1,title:'Tira led', estado: false,disp:true}
      ]

    },
    {
      id:1,
      descp:'sala',
      icon:'ios-albums',
      ipluces:'192.168.0.110',
      //ipluces:'localhost:3001/sala',
      idLuces:[
        {id:1,title:'Centrales', estado: false,disp:true},
        {id:2,title:'Comedor', estado: false,disp:true},
        {id:3,title:'Cuadro', estado: false,disp:true},
        {id:4,title:'Lateral', estado: false,disp:true}

      ]
    },
    {
      id:2,
      descp:'Ventana',
      icon:'ios-albums',
      ipluces:'192.168.0.111',
      //ipluces:'localhost:3001/ventana',
      idLuces:[
        {id:1,title:'Lateral', estado: false,disp:true}
      ]
    },

  ];
  tabs:Luces[]=[
    {
      id:0,
      descp:'Dorm - Master',
      icon:'md-people',
      ipluces:'192.168.0.112',
      //ipluces:'localhost:3001/dorm-master',
      idLuces:[
        {id:1,title:'Tira Led', estado: false,disp:true},
        {id:2,title:'Ditroicos laterales', estado: false,disp:true},
        {id:3,title:'Centrales', estado: false,disp:true}
      ]
    },
    {
      id:1,
      descp:'Dorm - Roberto',
      icon:'md-happy',
      ipluces:'192.168.0.114',
      //ipluces:'localhost:3001/dorm-robert',
      idLuces:[
        {id:1,title:'Tira Led', estado: false,disp:true},
        {id:2,title:'Ditroicos laterales', estado: false,disp:true},
        {id:3,title:'Centrales', estado: false,disp:true}
      ]
    },
    {
      id:2,
      descp:"Dorm - Belen",
      icon:'ios-happy-outline',
      ipluces:'192.168.0.113',
      //ipluces:'localhost:3001/dorm-belen',
      idLuces:[
        {id:1,title:'Centrales', estado: false,disp:true},
        {id:2,title:'Tira Led', estado: false,disp:true},
        {id:3,title:'Ditroicos laterales', estado: false,disp:true}
      ]
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsmenuPage');
  }

}
