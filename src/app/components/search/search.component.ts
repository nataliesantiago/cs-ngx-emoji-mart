import { Component, ChangeDetectorRef, OnInit, NgZone, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
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
  url: String = '';
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
    const { webkitSpeechRecognition }: IWindow = <any>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = this.languages[1];
    this.searchText = '';
    this.responseSearch.setActiveMostrarBarra(false);
    this.getPlaceholder();

  }

  getPlaceholder() {
    this.look_service.getSpecificSetting('placeholder_buscador').then((result) => {
      this.search_placeholder = result[0].valor;
    });
  }


  iniciarReconocimientoVoz(e: Event) {
    this.recognition.start();
  }




  /**
   * Function de configuracion de eventos, se ejecuta al iniciar el reconomiento de voz para asignar los trigers
   * de cada evento del api
   */
  private initRecognition() {
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
      this.def.setValue(interimTranscript);
      setTimeout(() => {
        this.nzone.run(() => {
          this.buscar(2);
        });
      }, 1000);
      this.changeDetector.detectChanges();
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
        debugger;
        this.dataImage = data.data.parrafos;
        this.url = data.data.url;
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

  /**
    * @param  {} val valor del item seleccionado
    * metodo de change del autocomplete
  */
  onChangeSearch(val: string) {
    return;/*
    this.searchText = val;
    if (!val || val == '') {
      delete this.textopredictivo;
    } else {
      this.searchService.autocompleteText(val).subscribe((data) =>
        this.textopredictivo = data.data
      );
    }*/

  }
  ngOnInit(): void {
    /**speech recognizion */
    // this.currentLanguage = this.languages[0];
    // this.speechRecognizer.initialize(this.currentLanguage);
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
    /**speech recognizion */
  }
  procesaValorCaja(value: string) {
    delete this.texto_sugerido;
    this.searchService.suggestCloudSearch(value, this.sugerencias).then(d => {
      // console.log(d);
      this.sugerencias = d.suggestResults;
      if (this.sugerencias && this.sugerencias.length > 1) {
        this.texto_sugerido = this.sugerencias[0].suggestedQuery;
      }
    });
    return '';
  }

  completarTexto(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.texto_sugerido) {
      this.def.setValue(this.texto_sugerido);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log('entro aca mono');
    const name: SimpleChange = changes.texto_buscar;
    this.texto_buscar = name.currentValue;
    this.def.setValue(this.texto_buscar);
  }
  buscar(metodo) {

    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = '';
    }
    //this.responseSearch.setResultados(this.textopredictivo);

    var date = new Date();
    var fecha = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    let obj = {
      'idUsuario': 1,
      'textoBusqueda': this.searchText,
      'idTipoBusqueda': metodo,
      'fechaBusqueda': fecha,
      'url': this.url
    };
    this.router.navigate(['/search/' + this.def.value]);
    //this.homeService.guardarBusqueda(obj).subscribe(data => );
    //this.nzone.run(() => this.stopRecognizer());
    //this.stopRecognizer();

  }
  buscar2() {
    this.nzone.run(() => this.buscar(this.metodo));
  }

}
