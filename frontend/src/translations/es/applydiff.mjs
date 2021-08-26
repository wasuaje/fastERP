// import {TRANSLATIONS_ES} from './translations.js'
// import {TRANSLATIONS_EMPTY} from './translation.js'

import TRANSLATIONS_ES from './translations.js';
// const {TRANSLATIONS_ES} = pkg;


import TRANSLATIONS_EMPTY2 from './translation.js';
const TRANSLATIONS_EMPTY = pkg;

console.log(TRANSLATIONS_EMPTY, TRANSLATIONS_ES)

const TRANSLATIONS_EMPTY_ENT = Object.entries(TRANSLATIONS_EMPTY)

TRANSLATIONS_EMPTY_ENT.forEach(element => {
    console.log(element[0], TRANSLATIONS_ES.hasOwnProperty(element[0]))
    if (!TRANSLATIONS_ES.hasOwnProperty(element[0])){
        TRANSLATIONS_ES[element[0]]=""
    }
    
});

console.log(TRANSLATIONS_ES)