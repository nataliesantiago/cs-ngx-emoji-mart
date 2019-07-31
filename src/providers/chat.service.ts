import { Injectable, Inject } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Subject } from 'rxjs/Subject';
import { NgZone } from '@angular/core/';
import * as io from "socket.io-client";
declare let gapi: any;
import * as firebase from "firebase";
import * as uuid from 'uuid/v4';
import { User } from '../schemas/user.schema';

/**
 * @description Servicio que controla toda la información que se usa en el chat
 */
@Injectable()
export class ChatService {

  user: User; // Objeto del usuario para contar con su iformación


  public subjectChat = new Subject<any>();
  public observableChat = this.subjectChat.asObservable();


  constructor(private ajax: AjaxService) {

  }






}
