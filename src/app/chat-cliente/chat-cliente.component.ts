import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../providers/ajax.service';
import { ChatService } from '../../providers/chat.service';


/**
 * @description Componente que maneja toda la funcionalidad del chat de clientes para 1-n chats, según configuración del administrador
 */
@Component({
  selector: 'app-chat-cliente',
  templateUrl: './chat-cliente.component.html',
  styleUrls: ['./chat-cliente.component.scss']
})
export class ChatClienteComponent implements OnInit {

  constructor(private ajax: AjaxService, private chatService: ChatService) { }

  ngOnInit() {
  }

}
