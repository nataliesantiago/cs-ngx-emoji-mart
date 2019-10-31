import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HistorialChatService } from '../../providers/historial-chat.service';

@Component({
  selector: 'app-dialogo-detalle-chat',
  templateUrl: './dialogo-detalle-chat.component.html',
  styleUrls: ['./dialogo-detalle-chat.component.scss']
})
export class DialogoDetalleChatComponent implements OnInit {

  info_chat;
  messages;
  is_empty_messages;

  constructor(public dialogRef: MatDialogRef<DialogoDetalleChatComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private historial_service: HistorialChatService) {
    this.info_chat = data;
    this.getMessages();
  }

  getMessages() {
    this.historial_service.getConversationMessages(this.info_chat.idtbl_conversacion).then(result => {
      this.messages = result;
      (this.messages.length == 0) ? this.is_empty_messages = true : this.is_empty_messages = false;
    });
  }

  decodeText(text) {
    return decodeURI(text);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
