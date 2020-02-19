import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../providers/user.service';
import { ChatService } from '../../providers/chat.service';
import { MotivoCierreChat } from '../../../schemas/interfaces';
import { User } from '../../../schemas/user.schema';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { UtilsService } from '../../providers/utils.service';

@Component({
  selector: 'app-cerrar-chat-experto',
  templateUrl: './cerrar-chat-experto.component.html',
  styleUrls: ['./cerrar-chat-experto.component.scss']
})
export class CerrarChatExpertoComponent implements OnInit {

  motivos: Array<MotivoCierreChat>;
  user: User;
  id_motivo_cierre: number;
  filtro = new FormControl();
  motivos_filtrados = [];
  loading = false;

  constructor(private dialogRef: MatDialogRef<CerrarChatExpertoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
          private userService: UserService, private chatServivce: ChatService, private utilsService: UtilsService) {
    this.user = this.userService.getUsuario();
    this.chatServivce.buscarMotivosCierreChat().then(m => {
      let motivos_cierre = this.utilsService.getUnique(m, 'nombre');
      this.motivos = this.motivos_filtrados = motivos_cierre;
      
    });
    if (data.no_cerro_experto) {
      dialogRef.disableClose = true;
    }    
  }

  ngOnInit() {
    this.filtro.valueChanges.subscribe(() => {
      if (!this.filtro.value || this.filtro.value == '') {
        this.motivos_filtrados = this.motivos;
      } else {
        this.motivos_filtrados = this.motivos.filter(m => {
          return m.nombre.toLowerCase().indexOf(this.filtro.value.toLowerCase()) != (-1);
        })
      }
    });
  }
  limpiar() {
    this.motivos_filtrados = this.motivos;
    this.filtro.setValue('');
  }
  cerrar(enviar: boolean) {
    if (enviar) {
      this.loading = true;
      this.dialogRef.close({ motivo: this.id_motivo_cierre });
    } else {
      this.dialogRef.close();
    }
  }
}
