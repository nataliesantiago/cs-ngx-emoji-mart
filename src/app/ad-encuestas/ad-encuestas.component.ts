import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { User } from '../../schemas/user.schema';

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
  user: User;
  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('encuestas/obtener', {}).subscribe(p => {
      if (p.success) {
        this.encuestas = p.encuestas;
        this.dataSource = new MatTableDataSource(this.encuestas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  init() {

  }

  ngOnInit() {
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-encuestas', e.idtbl_encuesta]);
  }

}
