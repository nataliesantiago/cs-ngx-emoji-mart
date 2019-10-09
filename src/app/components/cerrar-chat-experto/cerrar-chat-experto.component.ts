import { Component, OnInit } from '@angular/core';
import { UserService } from '../../providers/user.service';
import { ChatService } from '../../providers/chat.service';
import { MotivoCierreChat } from '../../../schemas/interfaces';
import { User } from '../../../schemas/user.schema';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cerrar-chat-experto',
  templateUrl: './cerrar-chat-experto.component.html',
  styleUrls: ['./cerrar-chat-experto.component.scss']
})
export class CerrarChatExpertoComponent implements OnInit {
  motivos: Array<MotivoCierreChat>;
  user: User;
  id_motivo_cierre: number;
  constructor(private dialogRef: MatDialogRef<CerrarChatExpertoComponent>, private userService: UserService, private chatServivce: ChatService) {
    this.user = this.userService.getUsuario();
    this.chatServivce.buscarMotivosCierreChat().then(m => {
      this.motivos = m;
    });
  }

  ngOnInit() {
  }
  cerrar(enviar: boolean) {
    if (enviar) {
      this.dialogRef.close({ motivo: this.id_motivo_cierre });
    } else {
      this.dialogRef.close();
    }
  }
}
