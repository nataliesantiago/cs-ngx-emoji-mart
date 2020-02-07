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
  selector: 'app-formulario-categoria-experticia',
  templateUrl: './formulario-categoria-experticia.component.html',
  styleUrls: ['./formulario-categoria-experticia.component.scss']
})
export class FormularioCategoriaExperticiaComponent implements OnInit {

  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  usuario;
  id_usuario;
  experticias=[];
  id_categoria_expertiz;
  categoria_expertiz = { nombre: ''};
  displayedColumns = ['id', 'experticia', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  experticia_asociada = [];
  editar = false;
  crear_experticia = false;

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
    .filter(params => params.id_categoria_expertiz)
    .subscribe(params => {
      

      this.id_categoria_expertiz = params.id_categoria_expertiz;
      
    });

    this.ajax.get('experticia/obtener', {}).subscribe(p => {
      if(p.success){
        this.experticias = p.experticias;
        this.options = p.experticias;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.experticias, value, 'nombre'))
        );
      }
    });

    if(this.id_categoria_expertiz != "nuevo"){
      this.editar = true;
      this.ajax.get('experticia/obtener-categoria-experticia', {id_categoria_experticia: this.id_categoria_expertiz}).subscribe(p => {
        if(p.success){
          this.categoria_expertiz = p.categoria[0];
          this.categoria_expertiz = this.categoria_expertiz[0];
          this.experticia_asociada = p.categoria[1];
          this.createTable(this.experticia_asociada);
          this.cg.detectChanges();
        }
      });
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

  anadirPreguntaAsociada(e){
    this.experticia_asociada.push(e);
    this.createTable(this.experticia_asociada);
    
    this.myControl = new FormControl(e.nombre);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
  }

  borrarElemento(e){

    swal.fire({
      title: 'Desvincular Experticia',
      text: "Confirme para desvincular la experticia",
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
          
          if(e.id_categoria_experticia != undefined){
            this.ajax.post('experticia/eliminar-asociacion-experticia', { experticia_asociada: e }).subscribe(d => {
              if(d.success){
                let pos = 0;
                for(let i = 0; i < this.experticia_asociada.length; i++){
                  if(this.experticia_asociada[i].idtbl_experticia == e.idtbl_experticia){
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
              if(this.experticia_asociada[i].idtbl_experticia == e.idtbl_experticia){
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
            if(this.experticia_asociada[i].idtbl_experticia == e.idtbl_experticia){
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

    if(this.categoria_expertiz.nombre == ""){

      swal.fire({
        title: 'Digite el nombre de la categoría de experticia',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })

    }else{

      if(this.editar){
        
        this.ajax.post('experticia/editar-categoria', { categoria_expertiz: this.categoria_expertiz, experticia_asociada: this.experticia_asociada }).subscribe(d => {
          if(d.success){
          
            this.router.navigate(['/ad-categoria-expertiz']);
          }
        })
      }else{
        
        this.ajax.post('experticia/guardar-categoria', { categoria_expertiz: this.categoria_expertiz, experticia_asociada: this.experticia_asociada }).subscribe(d => {
          if(d.success){
            
            this.router.navigate(['/ad-categoria-expertiz']);
          }
        })
      }

    }
    
  }

  habilitarExperticia(){
    this.crear_experticia = true;
  }

  actualizarLista(){
    this.ajax.get('experticia/obtener', {}).subscribe(p => {
      if(p.success){
        this.experticias = p.experticias;
        this.options = p.experticias;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
    this.crear_experticia = false;
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
  
  ngOnInit() {
  }

}

