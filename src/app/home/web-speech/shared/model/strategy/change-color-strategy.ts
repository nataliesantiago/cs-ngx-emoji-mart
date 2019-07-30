import { ActionStrategy } from './action-strategy';
import { Theme } from '../theme';
import { SpeechSynthesizerService } from '../../../shared/services/speech-synthesizer.service';

export class ChangeColorStrategy extends ActionStrategy {
    private mapStartSignal: Map<string, string> = new Map<string, string>();
    private mapEndSignal: Map<string, string> = new Map<string, string>();

    private mapInitResponse: Map<string, string> = new Map<string, string>();
    private mapFinishResponse: Map<string, string> = new Map<string, string>();
    private mapActionDone: Map<string, string> = new Map<string, string>();

    private mapThemes: Map<string, Theme[]> = new Map<string, Theme[]>();


    private speechSynthesizer: SpeechSynthesizerService = new SpeechSynthesizerService();

    constructor() {
        super();
        this.mapStartSignal.set('en-US', 'enable color');
        this.mapStartSignal.set('es-ES', 'activar color');

        this.mapEndSignal.set('en-US', 'disable color');
        this.mapEndSignal.set('es-ES', 'desactivar color');

        this.mapInitResponse.set('en-US', 'Please, tell me your color.');
        this.mapInitResponse.set('es-ES', 'Por favor, mencione un color de tema.');

        this.mapActionDone.set('en-US', 'Changing Theme of the Application to');
        this.mapActionDone.set('es-ES', 'Cambiando el color de tema a');

        this.mapFinishResponse.set('en-US', 'Your action has been completed.');
        this.mapFinishResponse.set('es-ES', 'La accion ha sido finalizada.');

        this.mapThemes.set('en-US', [
          {
            keyword: 'deep purple',
            href: 'deeppurple-amber.css'
          },
          {
            keyword: 'indigo',
            href: 'indigo-pink.css'
          },
          {
            keyword: 'pink',
            href: 'pink-bluegrey.css'
          },
          {
            keyword: 'purple',
            href: 'purple-green.css'
          }
        ]);
        this.mapThemes.set('es-ES', [
          {
            keyword: 'púrpura intenso',
            href: 'deeppurple-amber.css'
          },
          {
            keyword: 'azul',
            href: 'indigo-pink.css'
          },
          {
            keyword: 'rosa',
            href: 'pink-bluegrey.css'
          },
          {
            keyword: 'púrpura verde',
            href: 'purple-green.css'
          }
        ]);

    }

    /**
     * Triger event : reconoce el inicio de la configuracion del leguaje
     * @param language lenguaje de configuracion
     */
    getStartSignal(language: string): string {
        return this.mapStartSignal.get(language);
    }

    /**
     * Triger event : reconoce el fin de la configuracion del leguaje
     * @param language  lenguaje de configuracion
     */
    getEndSignal(language: string): string {
        return this.mapEndSignal.get(language);
    }
     
    /**
     * Reconoce la respuesta inciial del paquete de mensajeria
     * @param language lenguaje de configuracion
     */
    getInitialResponse(language: string): string {
        return this.mapInitResponse.get(language);
    }

    /**
     * Reconoce la respuesta final del paquete de mensajeria
     * @param language lenguaje de configuracion
     */
    getFinishResponse(language: string): string {
        return this.mapFinishResponse.get(language);
    }

    /**
     * Estrategia para menjo de la ui con respecto al reconocimiento de voz
     * @param input referencia del resultado del paqute de mensajeria
     * @param language lenguaje de configuracion
     * @deprecated 
     */
    runAction(input: string, language: string): void {
        const theme = this.mapThemes.get(language).find((th) => {
          return input.toLocaleLowerCase() === th.keyword;
        });
        if (theme) {
          this.speechSynthesizer.speak(`${this.mapActionDone.get(language)}: ${theme.keyword}`, language);
        }
    }
}
