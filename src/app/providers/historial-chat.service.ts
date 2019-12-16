import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
    providedIn: 'root'
})

export class HistorialChatService {

  constructor(private ajax: AjaxService) {
    
  }

  /**
   * ontiene todos los chat de un experto
   * @param user_id 
   */
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

  /**
   * obtiene todos los chat de un cliente
   * @param user_id 
   */
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

  /**
   * obtiene los mensajes de una conversacion, si la conversacion esta en estado pendiente y es un usuario cliente solo obtiene los mensajes 
   * enviados hasta el momento de actualizar a estado pendiente la conversacion, si la conversacion esta en un estado diferente
   * obtiene todos los mensajes
   * @param conversation_id 
   * @param state_id 
   * @param is_user 
   */
  getConversationMessages(conversation_id, state_id, is_user): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-mensajes', { conversation_id: conversation_id, state_id: state_id, is_user: is_user }).subscribe((message) => {
          if (message.success) {
            resolve(message.messages);
          } else {
            reject();
          }
        });
    });
  }

  /**
   * obtiene una conversacion por usuario
   * @param conversation_id 
   * @param user_id 
   */
  getOneConversation(conversation_id, user_id): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-una-conversacion', { conversation_id: conversation_id, user_id: user_id }).subscribe((c) => {
          if (c.success) {
            resolve(c.conversation);
          } else {
            reject();
          }
        });
    });
  }

  /**
   * obtiene las url de grabacion de una conversacion 
   * @param conversation_id 
   */
  getRecordingUrl(conversation_id): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.post('historial-chats/obtener-url-grabacion', { conversation_id: conversation_id }).subscribe((c) => {
          if (c.success) {
            resolve(c.url);
          } else {
            reject();
          }
        });
    });
  }

  /**
   * obtiene todas las conversaciones pendientes para el historial 
   * 
   */
  getPendingChat(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.ajax.get('historial-chats/obtener-conversaciones-pendientes', { }).subscribe((c) => {
          if (c.success) {
            resolve(c.chats);
          } else {
            reject();
          }
        });
    });
  }

}
