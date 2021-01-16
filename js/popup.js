/*
The MIT License (MIT)

Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {nanoid} from './nanoid.js';

function addFilter (){
    let filter = {
        type: filterForm.type.value,
        pattern: filterForm.pattern.value,
        text: filterForm.text.value,
        regex: filterForm.text.value
    }

    switch (filter.pattern) {
        case "先頭":
            filter.regex = "^" + filter.regex;
            break;
    
        case "末尾":
            filter.regex = filter.regex + "$";
            break;
    }

    let key = nanoid();

    chrome.storage.local.set({[key]: filter}, function(){});
}

document.filterForm.submit.addEventListener("click", function(){
    if (document.filterForm.text.value){
        addFilter();
        document.filterForm.text.value = "";
    }
});