import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
    providedIn: 'root'
})

export class HistorialChatService {

  constructor(private ajax: AjaxService) {
    
  }

  getExpertChats(user_id): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-conversacion-experto', { user_id: user_id }).subscribe((chats) => {
          if (chats.success) {
            resolve(chats.expert_chats);
          } else {
            reject();
          }
        });
    });
  }

  getClientChats(user_id): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-conversacion-cliente', { user_id: user_id }).subscribe((chats) => {
          if (chats.success) {
            resolve(chats.client_chats);
          } else {
            reject();
          }
        });
    });
  }

  getConversationMessages(conversation_id): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-mensajes', { conversation_id: conversation_id }).subscribe((message) => {
          if (message.success) {
            resolve(message.messages);
          } else {
            reject();
          }
        });
    });
  }

}
