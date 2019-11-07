import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';
import { MatPaginator, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { ChatService } from '../providers/chat.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit {

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
  tipo_busqueda: any;
  params: any;
  url_imagen_busqueda: string;
  origen: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTabGroup) tabs: MatTabGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public responseSearch: ResponseSearch,
    private homeService: HomeService,
    private searchService: SearchService,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.init();

  }

  paginar(pagina: any) {
    //console.log(pagina);
    this.page = pagina.pageIndex;
    this.router.navigateByUrl('/search?tipo=' + this.tipo_busqueda + '&&busqueda=' + encodeURI(this.busqueda) + '&&page=' + this.page + '&&url=' + this.url_imagen_busqueda + '&&origen=' + this.origen);
  }


  init() {
    //console.log(this.activatedRoute.snapshot.queryParamMap.get('fombre'));
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      this.tipo_busqueda = params['tipo'] || 1;
      if (this.tipo_busqueda == 2) {
        this.url_imagen_busqueda = params['url'];
      }
      if (params['origen']) {
        this.origen = params['origen'];
      }
      if (this.origen) {
        switch (this.origen) {
          case 'conecta':
            this.tabs.selectedIndex = 0;
            break;
          case 'chat':
            this.tabs.selectedIndex = 2;
            break;
          case 'drive':
            this.tabs.selectedIndex = 1;
            break;
          default:
            this.tabs.selectedIndex = 0;
            break
        }
      } else {
        this.origen = 'conecta';
        this.tabs.selectedIndex = 0;
      }
      this.cambioParametros(this.params);
    });

  }

  abrirChat() {
    let id_busqueda = this.searchService.busqueda_actual.idtbl_busqueda_usuario;
    //console.log(id_busqueda);
    this.chatService.crearConversacion(null, id_busqueda);
  }

  cambiaTab(e: MatTabChangeEvent) {
    //console.log(e);
    this.page = 0;
    switch (e.index) {
      case 0:
        this.origen = 'conecta';
        break;
      case 2:
        this.origen = 'chat';
        break;
      case 1:
        this.origen = 'drive';
        break;
    }
    this.router.navigateByUrl('/search?tipo=' + this.tipo_busqueda + '&&busqueda=' + encodeURI(this.busqueda) + '&&page=' + this.page + '&&url=' + this.url_imagen_busqueda + '&&origen=' + this.origen);
  }
  abrirRuta(ruta) {
    console.log(ruta);
    this.router.navigateByUrl(ruta);
  }
  cambioParametros(params) {
    // Se reinicializa el componente
    this.page = params.page || 0;
    this.cargando_respuestas = true;
    this.resultados = [];
    this.resultado = true;
    if (this.busqueda != params.busqueda) {
      this.busqueda = params.busqueda;
      this.ortografia = false;
      delete this.busquedaUrl;
      delete this.valorBusqueda;
      delete this.busquedaCorregida;
      delete this.respuesta;
      this.busquedaUrl = '/search?tipo=' + this.tipo_busqueda + '&&busqueda=' + encodeURI(this.busqueda) + '&&page=' + this.page + '&&url=' + this.url_imagen_busqueda + '&&origen=' + this.origen;
    } else {
      this.resultado = true;
    }
    this.searchService.queryCloudSearch(this.busqueda, this.tipo_busqueda, this.origen, this.page, true, params.url).then(d => {
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
        this.busquedaUrl = '/search?tipo=' + this.tipo_busqueda + '&&busqueda=' + encodeURI(this.busquedaCorregida) + '&&page=' + this.page + '&&url=' + this.url_imagen_busqueda + '&&origen=' + this.origen;
      }
      setTimeout(() => {
        if (this.paginator) {
          this.paginator._intl.firstPageLabel = 'Primera página';
          this.paginator._intl.lastPageLabel = 'Última página';
          this.paginator._intl.nextPageLabel = 'Página siguiente ';
          this.paginator._intl.previousPageLabel = 'Página anterior';
        }
      }, 1);
    });
  }
  buscar() {

    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}