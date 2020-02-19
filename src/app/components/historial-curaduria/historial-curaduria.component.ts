import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AjaxService } from '../../providers/ajax.service';
import { UserService } from '../../providers/user.service';
import { Router } from '@angular/router';
import { FiltrosService } from '../../providers/filtros.service';

export interface TransferenciaData {
  pregunta: any;
}

@Component({
  selector: 'app-historial-curaduria',
  templateUrl: './historial-curaduria.component.html',
  styleUrls: ['./historial-curaduria.component.scss']
})
export class HistorialCuraduriaComponent implements OnInit {

  comentarios;
  nota;
  usuario;
  id_usuario;
  notas = {};

  constructor(private dialogRef: MatDialogRef<HistorialCuraduriaComponent>, private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef, private filtros_service: FiltrosService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: TransferenciaData) {
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
        this.init();
      }
    })
  }

  init() {
    this.ajax.get('preguntas/obtener-comentarios-pregunta', { idtbl_pregunta: this.data.pregunta.idtbl_pregunta }).subscribe(async p => {
      if (p.success) {
        this.comentarios = p.comentarios;
        // console.log(this.comentarios);
      }
    });
  }

  ngOnInit() {
  }

  guardarComentario() {
    if (this.nota != "" && this.nota) {
      this.notas = { notas: this.nota, id_estado: this.data.pregunta.id_estado, id_estado_flujo: this.data.pregunta.id_estado_flujo, idtbl_pregunta: this.data.pregunta.idtbl_pregunta, id_usuario: this.id_usuario }
      this.ajax.post('preguntas/guardar-nota-curaduria', { nota: this.notas }).subscribe(p => {
        if (p.success) {
          this.dialogRef.close({ success: true });
        }
      })
    }else{
      this.dialogRef.close({ success: true });
    }

  }

}
