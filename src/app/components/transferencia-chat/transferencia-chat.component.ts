import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChatService } from '../../providers/chat.service';
import { UserService } from '../../providers/user.service';
import { User } from '../../../schemas/user.schema';
import { CategoriaExperticia } from '../../../schemas/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Conversacion } from '../../../schemas/conversacion.schema';
import { startWith, map } from 'rxjs/operators';
import { UtilsService } from '../../providers/utils.service';

export interface TransferenciaData {
  conversacion: Conversacion;
}


@Component({
  selector: 'app-transferencia-chat',
  templateUrl: './transferencia-chat.component.html',
  styleUrls: ['./transferencia-chat.component.scss']
})
export class TransferenciaChatComponent implements OnInit {
  user: User;
  expertos: Array<any> = [];
  expertos_filtrados;
  filas: Array<CategoriaExperticia>;
  tipo: number;
  categoria_experticia_control = new FormControl();
  experto_control = new FormControl();
  categoria: CategoriaExperticia;
  experto: User;
  error_transferencia: string;
  constructor(private dialogRef: MatDialogRef<TransferenciaChatComponent>, private chatService: ChatService, private userService: UserService, private fireStore: AngularFirestore, @Inject(MAT_DIALOG_DATA) private data: TransferenciaData, private utilsService: UtilsService) {
    this.user = this.userService.getUsuario();
    this.chatService.getCategoriasExperticia().then(c => {
      this.filas = c;
    });
    this.chatService.getExpertosTransferencia().then(expertos => {
      this.expertos = expertos.filter(e => {
        return e.idtbl_usuario != this.user.getId();
      });
    });
    this.expertos_filtrados = this.experto_control.valueChanges.pipe(startWith(''), map(value => this.utilsService.filter(this.expertos, value, 'nombre')))
  }

  ngOnInit() {
  }
  seleccionarCategoriaNueva(c: CategoriaExperticia) {
    this.categoria = c;
    this.categoria_experticia_control.setValue(c.nombre)
  }
  update(tempos?) {
    delete this.categoria;
    delete this.experto;
    if (!tempos) {
      this.categoria_experticia_control.setValue(null);
      this.experto_control.setValue(null);
    }
  }
  seleccionarExperto(c: User) {
    this.experto = c;
    this.experto_control.setValue(c.nombre)
  }
  transferirChat() {
    let id: number;
    delete this.error_transferencia;
    if (this.tipo == 1) {
      id = this.categoria.idtbl_categoria_experticia;
    } else {
      id = this.experto.idtbl_usuario;
    }
    this.chatService.transferirChat(this.data.conversacion, id, this.tipo).then(() => {
      this.dialogRef.close({ success: true });
    }, () => {
      this.error_transferencia = 'Error realizando la transferencia, por intente más tarde';
    })

  }
  onNoClick() {
    this.dialogRef.close();
  }
}

