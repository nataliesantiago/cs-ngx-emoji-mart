import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ChatService } from '../../providers/chat.service';
import { UserService } from '../../providers/user.service';
import { User } from '../../../schemas/user.schema';
import { CategoriaExperticia } from '../../../schemas/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transferencia-chat',
  templateUrl: './transferencia-chat.component.html',
  styleUrls: ['./transferencia-chat.component.scss']
})
export class TransferenciaChatComponent implements OnInit {
  user: User;
  expertos: Array<any> = [];
  filas: Array<CategoriaExperticia>;
  tipo: number;
  categoria_experticia_control = new FormControl();
  experto_control = new FormControl();
  categoria: CategoriaExperticia;
  experto: User;
  constructor(private dialogRef: MatDialogRef<TransferenciaChatComponent>, private chatService: ChatService, private userService: UserService, private fireStore: AngularFirestore) {
    this.user = this.userService.getUsuario();
    this.chatService.getCategoriasExperticia().then(c => {
      this.filas = c;
    });
    this.chatService.getExpertos().then(expertos => {
      expertos.forEach(e => {
        let b = this.fireStore.doc('expertos/' + e.idtbl_usuario).snapshotChanges();
        b.subscribe((datos: any) => {

          if (datos) {
            let data = datos.payload.data();
            if (data) {
              let ex = { idtbl_usuario: e.idtbl_usuario, activo: data.activo, ultima_conexion: data.fecha, nombre: e.nombre };
              let busqueda = this.expertos.find(experto => {
                return ex.idtbl_usuario == experto.idtbl_usuario;
              })
              if (busqueda) {
                busqueda.activo = ex.activo;
                busqueda.ultima_conexion = ex.ultima_conexion;
              } else {
                this.expertos.push(ex);
              }
            }
          }
        });
      });
    })
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
    this.dialogRef.close();
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
