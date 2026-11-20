import { foundations } from './foundations.js';
import { continuous } from './continuous.js';
import { modelling } from './modelling.js';
import { decisions } from './decisions.js';

export const units = [...foundations, ...continuous, ...modelling, ...decisions];
export const lessons = units.flatMap(unit => unit.lessons);
let index = 0;
units.forEach((unit, unitIndex) => {
  unit.number = unitIndex + 1;
  unit.lessons.forEach(lesson => {
    lesson.number = ++index;
    lesson.unit = unit.number;
  });
});
