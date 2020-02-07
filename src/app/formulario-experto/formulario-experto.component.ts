import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-formulario-experto',
  templateUrl: './formulario-experto.component.html',
  styleUrls: ['./formulario-experto.component.scss']
})
export class FormularioExpertoComponent implements OnInit {

  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  usuario;
  id_usuario;
  categorias=[];
  id_experto;
  categoria_expertiz = { nombre: ''};
  displayedColumns = ['experticia', 'id_horario', 'horario', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  experticia_asociada = [];
  editar = false;
  crear_experticia = false;
  nombre_experto;
  correo_experto;
  horarios = [];

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, 
              private qs: QuillService, private http: HttpClient, private utilsService: UtilsService){
    
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

  init(){

    this.route.params
    .filter(params => params.id_experto)
    .subscribe(params => {
      

      this.id_experto = params.id_experto;
      
    });

    this.ajax.get('experticia/obtener-categorias', {}).subscribe(p => {
      if(p.success){
        this.categorias = p.categorias;
        this.options = p.categorias;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.categorias, value, 'nombre'))
        );
      }
    });

    this.ajax.get('user/obtener-horarios-activos', {}).subscribe(p => {
      if(p.success){
        this.horarios = p.horarios;
      }
    });

    if(this.id_experto != "nuevo"){
      this.editar = true;
      this.ajax.get('user/obtener-informacion-experto', {id_experto: this.id_experto}).subscribe(p => {
        if(p.success){
          this.nombre_experto = p.informacion[0];
          this.correo_experto = this.nombre_experto[0].correo;
          this.nombre_experto = this.nombre_experto[0].nombre;
          this.experticia_asociada = p.informacion[1];
          this.createTable(this.experticia_asociada);
          this.cg.detectChanges();
        }
      });
    }
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  private _filter(value: any): string[] {
    
    if(value.nombre){
      const filterValue = value.nombre.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }else{
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

  anadirHorarioExperto(e){
    this.experticia_asociada.push(e);
    this.experticia_asociada[this.experticia_asociada.length - 1].nuevo = 1;
    this.createTable(this.experticia_asociada);
    
    this.myControl = new FormControl(e.nombre);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
  }

  agregarHorario(e){    
    this.ajax.get('user/horario-id', { id_horario_chat: e.idtbl_horario_chat}).subscribe(p => {
      if(p.success){
        e.hora_inicio = p.horario[0].hora_inicio;
        e.hora_fin = p.horario[0].hora_fin;
        e.lunes = p.horario[0].lunes;
        e.martes = p.horario[0].martes;
        e.miercoles = p.horario[0].miercoles;
        e.jueves = p.horario[0].jueves;
        e.viernes = p.horario[0].viernes;
        e.sabado = p.horario[0].sabado;
        e.domingo = p.horario[0].domingo;
        this.cg.detectChanges();
      }
    });
  }

  borrarElemento(e){

    swal.fire({
      title: 'Eliminar Categoría de Experticia',
      text: "Confirme para eliminar la categoría experticia",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        if(this.editar){
          
          if(e.idtbl_categoria_experticia != undefined){
            this.ajax.post('user/eliminar-asociacion-categoria-experticia', { experticia_asociada: e, id_experto: this.id_experto }).subscribe(d => {
              if(d.success){
                let pos = 0;
                for(let i = 0; i < this.experticia_asociada.length; i++){
                  if((this.experticia_asociada[i].idtbl_categoria_experticia == e.idtbl_categoria_experticia) && (this.experticia_asociada[i].idtbl_horario_chat == e.idtbl_horario_chat)){
                    pos = i;
                  }
                }
                this.experticia_asociada.splice(pos,1);
                this.createTable(this.experticia_asociada);
                this.cg.detectChanges();
              }
            })
          }else{
            let pos = 0;
            for(let i = 0; i < this.experticia_asociada.length; i++){
              if(this.experticia_asociada[i].idtbl_pregunta == e.idtbl_pregunta){
                pos = i;
              }
            }
            this.experticia_asociada.splice(pos,1);
            this.createTable(this.experticia_asociada);
            this.cg.detectChanges();
          }
        }else{
          let pos = 0;
          for(let i = 0; i < this.experticia_asociada.length; i++){
            if(this.experticia_asociada[i].idtbl_pregunta == e.idtbl_pregunta){
              pos = i;
            }
          }
          this.experticia_asociada.splice(pos,1);
          this.createTable(this.experticia_asociada);
          this.cg.detectChanges();
        }
      }
    })
  }

  enviarDato(){
    let enviarInfo = true;
    for(let i = 0; i < this.experticia_asociada.length; i++){
      if(!this.experticia_asociada[i].idtbl_horario_chat){
        enviarInfo = false;
      }
    }
    
    if(enviarInfo){
      if(this.editar){
    
        this.ajax.post('user/agregar-expertiz', { experticia_asociada: this.experticia_asociada, id_experto: this.id_experto, id_usuario: this.id_usuario }).subscribe(d => {
          if(d.success){
          
            this.router.navigate(['/ad-expertos']);
          }
        })
      }

    }else{
      swal.fire({
        title: 'Datos Incompletos',
        text: 'Porfavor seleccione horario para todas las categorias de expertiz',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      });
    }
    
  }

  habilitarExperticia(){
    this.crear_experticia = true;
  }

  actualizarLista(){
    this.ajax.get('experticia/obtener-categorias', {}).subscribe(p => {
      if(p.success){
        this.categorias = p.categorias;
        this.options = p.categorias;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.categorias, value, 'nombre'))
        );
      }
    });
    this.crear_experticia = false;
  }
  
  ngOnInit() {
  }

  /**
   * aplica los filtros generales a la tabla
   * @param filterValue 
  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
