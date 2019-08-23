import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        const seconds: number = Math.floor(value % 60);

        let minutos = minutes < 10 ? "0" + minutes : minutes;
        let segundos = seconds < 10 ? "0" + seconds : seconds;

        return minutos + ":" + segundos;

    }

}