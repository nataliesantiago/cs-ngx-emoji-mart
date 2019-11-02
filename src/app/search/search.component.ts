import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';
import { MatPaginator } from '@angular/material';

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
  length: number;
  pageEvent: number;
  page: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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

  paginar(pagina: any) {
    //console.log(pagina);

    this.router.navigate(['/search/' + this.busqueda + '/' + pagina.pageIndex]);
  }


  init() {

    this.activatedRoute.params.subscribe(params => {
      // Se reinicializa el componente
      this.page = params.page;
      this.cargando_respuestas = true;
      this.resultados = [];
      if (this.busqueda != params.id) {
        this.busqueda = params.id;
        this.ortografia = false;
        delete this.busquedaUrl;
        delete this.valorBusqueda;
        delete this.busquedaCorregida;
        delete this.respuesta;
        this.busquedaUrl = encodeURI(this.busqueda);
      } else {
        this.resultado = true;
      }
      this.searchService.queryCloudSearch(this.busqueda, this.page).then(d => {
        // console.log(d);
        /*d.results.forEach((r: ResultadoCloudSearch) => {
          let id = r.url.split('_')[0];
          this.searchService.obtenerPregunta(parseInt(id)).then(pregunta => {
            r.contenido = pregunta.respuesta;
          });
        });*/
        this.resultados = d.results;
        this.cargando_respuestas = false;
        if (parseInt(d.resultCountExact) < 1) {
          this.resultado = false;
        } else {
          this.length = parseInt(d.resultCountExact);
        }
        if (d.spellResults) {
          this.ortografia = true;
          this.busquedaCorregida = d.spellResults[0].suggestedQuery;
          this.busquedaUrl = (this.busquedaCorregida);
        }
        setTimeout(() => {
          this.paginator._intl.firstPageLabel = 'Primera página';
          this.paginator._intl.lastPageLabel = 'Última página';
          this.paginator._intl.nextPageLabel = 'Página siguiente ';
          this.paginator._intl.previousPageLabel = 'Página anterior';
        }, 1);
      });

    });
  }
  buscar() {

    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}
