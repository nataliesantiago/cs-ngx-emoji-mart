import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../providers/search.service';
import { ResultadoCloudSearch } from '../../../schemas/interfaces';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-resultado-search',
  templateUrl: './resultado-search.component.html',
  styleUrls: ['./resultado-search.component.scss']
})
export class ResultadoSearchComponent implements OnInit {
  @Input() respuesta: ResultadoCloudSearch;
  @Input() pos: number;
  @Input() busqueda: string;
  mostrando = true;

  constructor(private searchService: SearchService) {

  }

  init() {
    if (this.respuesta) {
      /* let tmp = this.respuesta.url.split('_');
       this.respuesta.idtbl_pregunta = parseInt(tmp[0]);
       this.searchService.obtenerPregunta(this.respuesta.idtbl_pregunta).then(pregunta => {
         //console.log('paso por aca', pregunta);
         this.respuesta.contenido = pregunta.respuesta.replace(/<[^>]*>/g, '');
         if (this.respuesta.metadata.source.name == environment.id_origen_conecta) {
           this.respuesta.url_icono = pregunta.icono_padre;
         }
         //console.log(this.respuesta, pregunta);
         this.mostrando = true;
       });*/
      if (this.respuesta.metadata.source.name == environment.id_origen_conecta) {
        this.respuesta.tipo = 'Conecta';
      }
      // this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('&nbsp;', '');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('titulo_respuesta:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('titulo_subrespuesta:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('contenido:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('titulo_subs:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('contenido_subs:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('titulo_segs:', ' ');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('texto_segs:', ' ');
      var parser = new DOMParser();
      this.respuesta.contenido = this.respuesta.snippet.snippet;
      this.respuesta.contenido = this.htmldecode(this.respuesta.contenido);
      this.respuesta.contenido = this.respuesta.contenido.replace(/<[^>]*>/g, '');
      this.respuesta.snippet.snippet = this.respuesta.snippet.snippet.replace('&nbsp;', ' ');

    }
  }

  htmldecode(str) {

    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
  ngOnInit() {
    this.init();
  }

}
