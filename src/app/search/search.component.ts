import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  resultado = true;
  busqueda: string;
  busquedaUrl: string;
  valorBusqueda: string;
  ortografia = false;
  busquedaCorregida: string;
  resultados: Array<ResultadoCloudSearch>;
  respuesta: any;
  cargando_respuestas = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public responseSearch: ResponseSearch,
    private homeService: HomeService,
    private searchService: SearchService
  ) {
  }

  ngOnInit() {
    this.init();

  }
  init() {

    this.activatedRoute.params.subscribe(params => {
      // Se reinicializa el componente
      this.resultados = [];
      this.busqueda = params.id;
      this.resultado = true;
      this.ortografia = false;
      delete this.busquedaUrl;
      delete this.valorBusqueda;
      delete this.busquedaCorregida;
      delete this.respuesta;
      ////////////////////////////////

      this.busquedaUrl = encodeURI(this.busqueda);
      this.cargando_respuestas = true;
      this.searchService.queryCloudSearch(this.busqueda).then(d => {
        //console.log(d);
        /*d.results.forEach((r: ResultadoCloudSearch) => {
          let id = r.url.split('_')[0];
          this.searchService.obtenerPregunta(parseInt(id)).then(pregunta => {
            r.contenido = pregunta.respuesta;
          });
        });*/
        this.resultados = d.results;
        this.cargando_respuestas = false;
        if (d.resultCountExact < 1) {
          this.resultado = false;
        }
        if (d.spellResults) {
          this.ortografia = true;
          this.busquedaCorregida = d.spellResults[0].suggestedQuery;
          this.busquedaUrl = (this.busquedaCorregida);
        }

      });
    });
  }
  buscar() {

    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}
