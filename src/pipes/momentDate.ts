import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;

@Pipe({ name: 'MomentDate' })
export class MomentDate implements PipeTransform {
  // adding a default value in case you don't want to pass the format then 'yyyy-MM-dd' will be used
  transform(date: Date | string, format: string = 'MMM DD, YYYY'): string {
    date = new Date(date);  // if orginal type was a string
    date.setDate(date.getDate());
    return moment(new Date(date)).format(format);
  }
}