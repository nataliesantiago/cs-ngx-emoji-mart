import { Injectable, Inject } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Subject } from 'rxjs/Subject';
import { NgZone } from '@angular/core/';
import * as io from "socket.io-client";
declare let gapi: any;
import * as firebase from "firebase";
import * as uuid from 'uuid/v4';
import { User } from '../schemas/user.schema';


@Injectable()
export class ChatService {

  user: User;
  id_calendario: string;
  public socket: io.SocketIOClient.Socket;
  public subjectUsuario = new Subject<any>();
  public observableUsuario = this.subjectUsuario.asObservable();
  planeaciones_creadas = [];

  public subjectScoket = new Subject<any>();
  public observableSocket = this.subjectScoket.asObservable();
  SCOKET_IP;
  conectado_socket = false;
  dataBase;
  ref;
  este;

  constructor(private ajax: AjaxService) {

  }






}
