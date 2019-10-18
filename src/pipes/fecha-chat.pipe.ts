import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
@Pipe({ name: 'datechat' })
export class FechaChatPipe implements PipeTransform {
    transform(value: any): string {
        var now = moment(new Date()); //todays date
        var end = moment(value); // another date
        let dias = now.dayOfYear() == end.dayOfYear();
        let annios = now.year() == end.year();
        if (dias && annios) {
            return moment(value).local().format('hh:mm a');
        } else if (!dias && annios) {
            return moment(value).local().format('DD MMM hh:mm a');
        } else if (!annios) {
            return moment(value).local().format('YYYY-MM-DD hh:mm a');
        } else {
            return moment(value).local().format('YYYY-MM-DD hh:mm a');
        }
    }
}