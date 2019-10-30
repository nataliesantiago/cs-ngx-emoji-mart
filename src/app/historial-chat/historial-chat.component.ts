import { Component, OnInit } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { UserService } from '../providers/user.service';
import { HistorialChatService } from '../providers/historial-chat.service';

@Component({
  selector: 'app-historial-chat',
  templateUrl: './historial-chat.component.html',
  styleUrls: ['./historial-chat.component.scss']
})
export class HistorialChatComponent implements OnInit {

  user: User;
  chats_list;
  sidePanelOpened = true;

  constructor(private userService: UserService, private historial_service: HistorialChatService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
    });

    if (this.user) {
      this.init();
    }
  }

  ngOnInit() {
    
  }

  init() {
    if (this.user.getIdRol() == 2) {
      this.getExpertChat();
    } else {
      this.getClientChat();
    }
  }

  getExpertChat() {
    this.historial_service.getExpertChats(this.user.getId()).then(result => {
      this.chats_list = [...result];
      console.log(this.chats_list);
      
    });
  }

  getClientChat() {
    this.historial_service.getClientChats(this.user.getId()).then(result => {
      this.chats_list = result;
    });
  }

}
