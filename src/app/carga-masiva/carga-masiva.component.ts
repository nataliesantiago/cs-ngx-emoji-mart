import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { FiltrosService } from '../providers/filtros.service';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  active_download = false;
  file_name = '';
  csv_file: File;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['question_id', 'title', 'user_id', 'create_date', 'state_id', 'details', 'create', 'errors'];
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [];
  data = [];
  loading = false;
  estados_pregunta;
  filters = {};

  constructor(private ajax: AjaxService, private change_detector: ChangeDetectorRef, public dialog: MatDialog, 
              private filtros_service: FiltrosService) {

  }

  ngOnInit() {
    this.filtros_service.getQuestionStates().then(result => {
      this.estados_pregunta = result;
    });
  }

  /**
   * Funcion para descargar el archivo csv con el formato definido
   */
  downloadCsvFile() {
    let csv_headers = [
      ['Pregunta,Respuesta,Correo_usuario_creador,Fecha_creacion,Correo_usuario_ultima_modificacion,Fecha_ultima_modificacion,Identificador_producto,Estado,Estado_flujo,Muestra_fecha_actualizacion'],
      ['"","","","","","","","","",0']
    ];
    let csv_content = csv_headers.map(e => e.join(",")).join("\n");

    let link = document.createElement("a");
    link.href = 'data:text/csv; charset=UTF-8,%EF%BB%BF' + encodeURIComponent(csv_content);
    link.download = "formato-preguntas-respuestas.csv";
    window.document.body.appendChild(link);
    link.click();
    this.active_download = true;
  }

  /**
   * Funcion para validar que el archivo cargado sea .csv
  */
  uploadCsvFile(event) {
    let extension = event.target.files[0].name.split('.').pop().toLowerCase();
    if (extension == 'csv') {
      this.csv_file = event.target.files[0];
      this.file_name = this.csv_file.name;
    } else {
      this.showExtensionAlert(event);
    }
  }

  /**
   * Funcion para mostrar una alerta informando que el la extension es invalida
  */
  showExtensionAlert(event) {
    swal.fire({
      title: 'Formato no permitido',
      text: "Formato del archivo no permitido, por favor suba un archivo .csv",
      type: 'warning',
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        event.srcElement.value = null;
        this.file_name = '';
        this.csv_file = null;
      }
    });
  }

  /**
   * Funcion para enviar el archivo a procesar
  */
  sendCsvFile() {
    if (this.csv_file != undefined || this.csv_file != null) {
      this.loading = true;
      const form_data = new FormData();
      form_data.append('csv_file', this.csv_file);
      this.ajax.postData('preguntas/cargar-archivo', form_data).subscribe(data => {
        if (data.success == true) {
          this.data = data.questions;
          this.createTable(this.data);
          this.loading = false;
        }
      });
    } else {
      swal.fire({
        title: 'Advertencia',
        text: "Por favor suba un archivo .csv",
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

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.change_detector.detectChanges();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  /**
   * Funcion para visualizar toda la informacion de cada pregunta
  */
  moreInfo(row) {
    let action = 'show_details';
    this.dialog.open(DialogOverviewDetailQuestion, {
      width: '600px',
      height: '90vh',
      data: { ...row, action }
    });
  }

  /**
   * Funcion para visualizar los errores de cada pregunta
  */
  showErrors(row) {
    let action = 'show_errors';
    this.dialog.open(DialogOverviewDetailQuestion, {
      width: '600px',
      height: '90vh',
      data: { ...row.errors, action }
    });
  }

  /**
   * Funcion para validar si un objeto esta vacio
  */
  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  /**
   * Funcion para aplicar el filtro de la tabla
  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /**
   * funcion para realizar filtros por algun tipo o estado
   * @param name nombre del campo por el cual se va a filtrar
   * @param event de este parametro se obtiene el valor seleccionado a filtrar
   */
  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.data);
    } else {
      this.filters[name] = event.value;
      let newArray = this.data;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}

@Component({
  selector: 'detalle-pregunta-dialog',
  templateUrl: 'detalle-pregunta-dialog.html',
  styleUrls: ['./carga-masiva.component.scss']
})

export class DialogOverviewDetailQuestion {

  data_question;
  keys;
  constructor(public dialogRef: MatDialogRef<DialogOverviewDetailQuestion>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.keys = Object.keys(data).filter(element => {
      return element != 'action' && element != 'errors';
    });
    this.data_question = data;
  }

  /**
   * funcion para cerrar la modal que muestra la informacion o los errores de las preguntas
   */
  closeDialog() {
    this.dialogRef.close();
  }

}