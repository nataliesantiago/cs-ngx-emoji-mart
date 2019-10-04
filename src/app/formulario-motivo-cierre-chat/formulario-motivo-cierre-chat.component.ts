import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulario-motivo-cierre-chat',
  templateUrl: './formulario-motivo-cierre-chat.component.html',
  styleUrls: ['./formulario-motivo-cierre-chat.component.scss']
})
export class FormularioMotivoCierreChatComponent implements OnInit {

  user;
  user_id;
  id_producto_editar;
  reason = { name: '', create_user_id: '', create_date: '', update_last_user_id: '', update_date: '', active: 1 };


  constructor(private ajax: AjaxService, private user_service: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService, private http: HttpClient) { 

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
    })

  }

  ngOnInit() {

  }

  init(){

    this.route.queryParams
    .filter(params => params.id_producto)
    .subscribe(params => {
      this.id_producto_editar = params.id_producto;
    });

  }

  saveReason(){

    if(this.id_producto_editar){
      this.ajax.post('producto/editar', { producto: this.reason, user_id: this.user_id }).subscribe(d => {
        if(d.success){
          this.router.navigate(['/motivo-cierre-chat']);
        }
      })
    }else{
      this.ajax.post('motivos-cierre-chat/guardar', { reason: this.reason, user_id: this.user_id }).subscribe(d => {
        if(d.success){
          this.router.navigate(['/motivo-cierre-chat']);
        }
      })
    }
    
  }


}
