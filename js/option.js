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

function showFilterList (){
    chrome.storage.local.get(null, function(allItem){
        for (let key in allItem) {
            addFilterList(allItem[key].type, allItem[key].pattern, allItem[key].text, key);
        }
    })
}

showFilterList();

function addFilterList (type, pattern, text, key) {
    let tr = document.createElement("tr");
    let td_type = document.createElement("td");
    td_type.innerText = type;

    let td_pattern = document.createElement("td");
    td_pattern.innerText = pattern;

    let td_text = document.createElement("td");
    td_text.innerText = text;

    let td_remove = document.createElement("td");
    let button_remove = document.createElement("button");
    button_remove.className = "button_remove";
    button_remove.innerText = "削除";
    button_remove.dataset.key = key;

    let filterListTable = document.getElementById("filterListTable");
    filterListTable.appendChild(tr);
    tr.appendChild(td_type);
    tr.appendChild(td_pattern);
    tr.appendChild(td_text);
    tr.appendChild(td_remove);
    td_remove.appendChild(button_remove);
    

    button_remove.addEventListener("click", function (){
        chrome.storage.local.remove(this.dataset.key, function(){});

        this.parentNode.parentNode.remove();
    });
}

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

    chrome.storage.local.set({[key]: filter}, addFilterList(filter.type, filter.pattern, filter.text, key));
}

function changeSample(form) {
    let sample = document.getElementById("sampleText");
    let matchText = "<span class=sampleMatchText>" + document.filterForm.text.value + "</span>"; 
    switch (document.filterForm.pattern.value) {
        case "全体":
            sample.innerHTML = matchText + "あっぷるぐーぐる"+ matchText + "ついったー" + matchText;
            break;
    
        case "先頭":
            sample.innerHTML = matchText + "あっぷるぐーぐる"+ document.filterForm.text.value + "ついったー" + document.filterForm.text.value;
            break;

        case "末尾":
            sample.innerHTML = document.filterForm.text.value + "あっぷるぐーぐる"+ document.filterForm.text.value + "ついったー" + matchText;
            break;
    }
}

document.filterForm.submit.addEventListener("click", function(){
    if (document.filterForm.text.value){
        addFilter();
        document.filterForm.text.value = "";
    }
});

document.filterForm.addEventListener("input", changeSample);