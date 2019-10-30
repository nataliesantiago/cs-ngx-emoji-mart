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

  constructor(private searchService: SearchService) {
    if (this.respuesta) {
      let tmp = this.respuesta.url.split('_');
      this.respuesta.idtbl_pregunta = parseInt(tmp[0]);
      this.searchService.obtenerPregunta(this.respuesta.idtbl_pregunta).then(pregunta => {
        this.respuesta.contenido = pregunta.respuesta;
      });
      if (this.respuesta.metadata.source.name == environment.id_origen_conecta) {
        this.respuesta.tipo = 'Conecta';
      }

    }
  }


  ngOnInit() {
  }

}
