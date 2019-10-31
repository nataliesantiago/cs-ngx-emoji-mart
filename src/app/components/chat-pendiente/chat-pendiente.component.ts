import { Component, OnInit } from '@angular/core';
import { UserService } from '../../providers/user.service';
import { ChatService } from '../../providers/chat.service';
import { User } from '../../../schemas/user.schema';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-chat-pendiente',
  templateUrl: './chat-pendiente.component.html',
  styleUrls: ['./chat-pendiente.component.scss']
})
export class ChatPendienteComponent implements OnInit {

  user: User;

  constructor(private dialogRef: MatDialogRef<ChatPendienteComponent>, private userService: UserService, private chatServivce: ChatService) {
    this.user = this.userService.getUsuario();

  }

  ngOnInit() {
  }

}
