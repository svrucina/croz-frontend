import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(date: Date | string, format: string = 'dd.MM.yyyy. HH:mm'): string {
    date = new Date(date);  // if original type was a string
    return new DatePipe('en-US').transform(date, format);
  }

}
