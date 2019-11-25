import { Component, ChangeDetectorRef, OnInit, NgZone, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { ResponseSearch } from '../../models/response-search';

//speech recognizion
import { SpeechRecognizerService } from '../../home/web-speech/shared/services/speech-recognizer.service';

import { SpeechNotification } from '../../home/web-speech/shared/model/speech-notification';
import { SpeechError } from '../../home/web-speech/shared/model/speech-error';
import { ActionContext } from '../../home/web-speech/shared/model/strategy/action-context';
import { AutenticationService } from '../../services/autenticacion.service';
import { SearchService } from '../../providers/search.service';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { LookFeelService } from '../../providers/look-feel.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { MatPaginator, MatTabGroup } from '@angular/material';
import swal from 'sweetalert2';
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'app-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class AppSearchComponent implements OnChanges, OnInit {
  url: string = '';
  metodo = 1;
  public def = new FormControl(''); // Model del autocomplete
  searchText: string; // ngModel del autocomplete
  defaultSelectedNgAutocomplete: string;
  file: File; // guardar archivo para buscar
  myForm: FormControl; // form del autocomplete
  keyword = 'title'; // reconoce el atributo del json para el autocomplete
  filteredOptions: Observable<any[]>; // guardar el resultado de las busquedas
  dataImage = [];
  sugerencias = [];
  texto_sugerido: string;
  textopredictivo: any = [
  ]; // guardar el texto predictivo de la api

  textError = 'no hay resultados'; // label del autocomplete

  /**web speech start */
  finalTranscript = ''; //valor final de el resultado del speech
  recognizing = false; //flag 
  notification: string;
  languages: string[] = ['en-US', 'es-CO'];
  currentLanguage = this.languages[1];
  actionContext: ActionContext = new ActionContext();
  @ViewChild('autocomplete') autocomplete: AutocompleteComponent;
  search_placeholder = '';
  @Input() modo: number;
  @Input() texto_buscar: string;
  recognition;
  busqueda: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTabGroup) tabs: MatTabGroup;
  page: number;
  resultados: any;
  cargando_respuestas: boolean;
  resultado: boolean;
  length: number;
  ortografia: boolean;
  busquedaCorregida: any;
  busquedaUrl: any;
  @ViewChild('primero') primero: ElementRef;
  @ViewChild('segundo') segundo: ElementRef;
  @ViewChild('adjunto') adjunto: ElementRef;
  url_logo = '';
  constructor(
    private router: Router,
    private searchService: SearchService,
    public responseSearch: ResponseSearch,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private nzone: NgZone,
    private autenticationService: AutenticationService,
    private look_service: LookFeelService
  ) {


    this.searchText = '';

    try {
      const { webkitSpeechRecognition }: IWindow = <any>window;
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = this.languages[1];
    } catch (e) {
      console.log('Navegador incompatible con reconocimiento de voz');
    }
    this.responseSearch.setActiveMostrarBarra(false);
    this.look_service.getSpecificSetting('url_logo').then((result) => {
      if (result && result[0] && result[0].valor) {
        this.url_logo = result[0].valor;
        this.changeDetector.detectChanges();
      }

    });

  }

  getPlaceholder() {
    if (this.modo != 3) {
      this.look_service.getSpecificSetting('placeholder_buscador').then((result) => {
        this.search_placeholder = result[0].valor;
      });
    } else {
      this.search_placeholder = 'Autogestión';
    }
  }


  iniciarReconocimientoVoz(e: Event) {
    this.recognition.start();
  }




  /**
   * Function de configuracion de eventos, se ejecuta al iniciar el reconomiento de voz para asignar los trigers
   * de cada evento del api
   */
  private initRecognition() {
    if (this.recognition) {
      this.recognition.onaudiostart = () => {
        this.recognizing = true;
        this.changeDetector.detectChanges();
      }

      this.recognition.onspeechend = () => {
        this.recognizing = false;
        this.changeDetector.detectChanges();
      }

      this.recognition.onresult = event => {
        let interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            interimTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        delete this.texto_sugerido;
        this.nzone.run(() => {
          this.def.setValue(interimTranscript);
          setTimeout(() => {
            this.buscar(2);
          }, 100);
        });

        this.changeDetector.detectChanges();
      }
    }

  }

  /**
     * @param  {} event captura el evento del input file
     *  Captura el file en un formdata para enviarlo al servicio y asigna el valor retornado de  la api
     * al input de busqueda para realizar el metodo de buscar()
  */
  onFileSelected(event) {
    this.metodo = 2;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', this.file);
      this.searchService.searchFile(formData).subscribe((data) => {
        //debugger;
        this.dataImage = data.data.parrafos;
        this.url = encodeURI(data.data.url);
        let texto = this.dataImage.join('+');
        if (this.dataImage && this.dataImage.length > 0) {
          this.def.setValue(texto);
          this.adjunto.nativeElement.value = '';
          this.buscar(2);
        } else {
          swal.fire({ type: 'error', text: 'No se encontró texto en la imagen' });
        }
      }
      );
    }
  }
  selectLabel(val: string, pos: number) {
    this.searchText = this.searchText + ' ' + val;
    this.dataImage.splice(pos, 1);
    this.def = new FormControl(' ' + this.searchText);
  }
  /**
   * Promise : ejecuta una espera por cierta cantidad de tiempo especificada en milisegundos
   * @param ms tiempo de espera en milisegundos
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Detiene el reconocimiento de voz y el stream de audio actual y envia el resultado a la busqueda 
   */
  stopRecognizer() {
    this.speechRecognizer.stop();
  }

  /**
   * Actualiza el mensaje de ayuda para el icono de reconocimiento de voz por medio del id del elemento 
   * @param id id del elemento
   * @param val valor para el elemento seleccionado
   */
  updateiconVoiceSearch(id, val) {
    document.getElementById(id).innerHTML = val;
  }

  /**
   * detecta cambios en el reconocimiento de voz como la seleccion de lenguaje
   */
  detectChanges() {
    this.changeDetector.detectChanges();
  }

  /**web speech end */

  /**
    * @param  {} item item del json del autocomplete
    * asignar a la variable title a searchText
  */
  selectEvent(item) {
    console.log(item);
    this.metodo = 1;
    //this.searchText = item.title;
    this.def.setValue(item.suggestedQuery);
    this.buscar(1);
  }

  /**
   * @description Se encarga de limpiar las opciones cuando se le da click al autocmpletar
   */
  clearOptions() {
    delete this.textopredictivo;
    document.getElementsByClassName('input-container')[0].getElementsByTagName('input')[0].focus();
    setTimeout(() => {
      this.autocomplete.close();
    }, 1);
  }


  ngOnInit(): void {
    // console.log('estuvo por aqui')
    this.initRecognition();
    this.notification = null;
    this.def.setValue(this.texto_buscar);
    this.def.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(value => this.procesaValorCaja(value))
      ).subscribe(d => {
        // console.log(d);
      });
    this.getPlaceholder();
  }
  procesaValorCaja(value: string) {

    this.searchService.suggestCloudSearch(value, this.sugerencias).then(d => {
      // console.log(d);
      delete this.texto_sugerido;
      this.sugerencias = d.suggestResults;
      if (this.sugerencias && this.sugerencias.length > 0) {
        let t = this.sugerencias[0].suggestedQuery;
        // this.texto_sugerido = t.replace(t.substring(0, this.def.value.length), this.def.value);
        if (this.def.value && this.def.value != '' && this.def.value != 'undefined') {
          this.texto_sugerido = this.def.value + t.replace(this.def.value, '');
        }
        setTimeout(() => {
          this.segundo.nativeElement.scrollLeft = this.primero.nativeElement.scrollLeft;
          //console.log(this.segundo, this.primero);
        }, 0);

      }
    });
    return [];
  }


  paginar(pagina: any) {
    //console.log(pagina);
    this.page = pagina.pageIndex;
    this.buscar(this.metodo);
  }

  completarTexto(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.texto_sugerido) {
      this.def.setValue(this.texto_sugerido);
      setTimeout(() => {
        let element = this.primero.nativeElement;
        this.primero.nativeElement.scrollLeft = element.scrollWidth - element.clientWidth;
        this.segundo.nativeElement.scrollLeft = this.primero.nativeElement.scrollLeft;
        //console.log(this.segundo, this.primero);
      }, 0);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log('entro aca mono', this.modo);
    //console.log('paso por aca');
    const name: SimpleChange = changes.texto_buscar;
    this.texto_buscar = name.currentValue;
    this.def.setValue(this.texto_buscar);
    if (this.modo == 3) {
      this.buscar(1);
    }
  }

  limpiarSugerencia() {
    delete this.texto_sugerido;
  }

  updateScroll(primero: HTMLElement, segundo: HTMLElement) {
    console.log('paso por aca')
    setTimeout(() => {
      segundo.scrollLeft = primero.scrollLeft;
      console.log(segundo, primero);
    }, 1);

  }

  buscar(metodo) {
    if (!this.def.value || this.def.value == '') {
      return;
    }
    this.metodo = metodo;
    if (this.modo == 3) {
      this.busqueda = this.def.value;
      this.cargando_respuestas = true;
      this.searchService.queryCloudSearch(this.busqueda, metodo, 'conecta', this.page).then(d => {
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
          if (this.paginator) {
            this.paginator._intl.firstPageLabel = 'Primera página';
            this.paginator._intl.lastPageLabel = 'Última página';
            this.paginator._intl.nextPageLabel = 'Página siguiente ';
            this.paginator._intl.previousPageLabel = 'Página anterior';
          }
        }, 1);
      });
    } else {



      if (this.searchText === null && this.searchText === undefined) {
        this.searchText = '';
      }
      let url = btoa(this.url);

      setTimeout(() => {
        this.router.navigateByUrl('/search?tipo=' + metodo + '&&url=' + url + '&&busqueda=' + encodeURI(this.def.value));
      }, 0);

    }
    //this.homeService.guardarBusqueda(obj).subscribe(data => );
    //this.nzone.run(() => this.stopRecognizer());
    //this.stopRecognizer();

  }
  buscar2() {
    this.nzone.run(() => this.buscar(this.metodo));
  }

}
