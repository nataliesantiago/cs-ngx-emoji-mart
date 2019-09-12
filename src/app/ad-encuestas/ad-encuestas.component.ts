import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-ad-encuestas',
  templateUrl: './ad-encuestas.component.html',
  styleUrls: ['./ad-encuestas.component.scss']
})
export class AdEncuestasComponent implements OnInit {

  usuario;
  id_usuario;
  encuestas = [];
  displayedColumns = ['acciones', 'id', 'nombre', 'estado'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        this.id_usuario = d.usuario[0].idtbl_usuario;        
      }
    });

    this.usuario = this.user.getUsuario();
    if (this.usuario) {
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
      }
    })

    this.ajax.get('encuestas/obtener', {}).subscribe(p => {
      if(p.success){
        this.encuestas = p.encuestas;
        this.dataSource = new MatTableDataSource(this.encuestas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;                              
      }
    })

   }

  ngOnInit() {
  }

  editarRegistro(e){
    this.router.navigate(['/formulario-encuestas', e.idtbl_encuesta]);
  }

}
