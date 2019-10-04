import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-motivo-cierre-chat',
  templateUrl: './formulario-motivo-cierre-chat.component.html',
  styleUrls: ['./formulario-motivo-cierre-chat.component.scss']
})
export class FormularioMotivoCierreChatComponent implements OnInit {

  user;
  user_id;
  update_reason_id;
  reason = { idtbl_motivo_cierre_chat: '', name: '', create_user_id: '', create_date: '', update_last_user_id: '', update_date: '', active: 1 };
  is_edit = false;


  constructor(private ajax: AjaxService, private user_service: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef) { 

    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.user_id = this.user.idtbl_usuario;
      this.init();
    }
    this.user_service.observableUsuario.subscribe(u => {
      this.user = u;
      this.user_id = u.idtbl_usuario;
      if (this.user) {
        this.init();
      }
    });

    this.getReason();
  }

  ngOnInit() {

  }

  /**
   * Funcion para obtener el parametro de la url
   */
  init(){
    this.route.params.subscribe( params => {
      this.update_reason_id = params['reason_id'];
    }); 
  }

  /**
   * Funcion para obtener la iformacion de un motivo especifico 
   */
  getReason() {
    if( this.update_reason_id != 'nuevo') {
      this.is_edit = true;
      this.ajax.post('motivos-cierre-chat/obtener-motivo', {reason_id: this.update_reason_id}).subscribe(response => {
        if(response.success){
          this.reason = response.reasons[0];
          this.reason.name = response.reasons[0].nombre;
        }
      });
    }
  }

  /**
   * Funcion para guardar la informacion del motivo de cierre
   */
  saveReason() {
    if(!this.is_edit) {
      if(this.reason.name == ""){
        swal.fire({
          title: 'El motivo de cierre es obligatorio',
          text: '',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept',
          confirmButtonText: 'Aceptar',
        });
      } else if(this.reason.name.length > 450) {
        swal.fire({
          title: 'El limite de caracteres permitidos es 450',
          text: '',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept',
          confirmButtonText: 'Aceptar',
        });
      } else {
        this.ajax.post('motivos-cierre-chat/guardar', { reason: this.reason, user_id: this.user_id }).subscribe(d => {
          if(d.success){
            this.router.navigate(['/motivo-cierre-chat']);
          }
        });
      }
    }else{
      this.ajax.post('motivos-cierre-chat/editar', { reason: {reason_id: this.reason.idtbl_motivo_cierre_chat, name: this.reason.name }, user_id: this.user_id }).subscribe(d => {
        if(d.success){
          this.router.navigate(['/motivo-cierre-chat']);
        }
      });
    }
    
  }


}
