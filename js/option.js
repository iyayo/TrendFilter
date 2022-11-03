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
    chrome.storage.local.get(null, allItem => {
        for (let key in allItem) {
            addFilterList(allItem[key].type, allItem[key].pattern, allItem[key].text, key);
        }
    })
}

showFilterList();

function addFilterList (type, pattern, text, key) {
    const tr = document.createElement("tr");
    const td_type = document.createElement("td");
    td_type.innerText = type;

    const td_pattern = document.createElement("td");
    td_pattern.innerText = pattern;

    const td_text = document.createElement("td");
    td_text.innerText = text;

    td_type.className, td_pattern.className, td_text.className = "align-middle";

    const td_checkbox = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input";
    checkbox.value = key;

    const filterListTable = document.getElementById("filterListTable");
    filterListTable.append(tr);
    tr.append(td_type, td_pattern, td_text, td_checkbox);
    td_checkbox.append(checkbox);
}

function addFilter (){
    let filter = {
        type: filterForm.type.value,
        pattern: filterForm.pattern.value,
        text: filterForm.text.value,
        regex: filterForm.text.value
    }

    if (filter.pattern !== "正規表現"){
        filter.regex = filter.text.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');

        switch (filter.pattern) {
            case "先頭":
                filter.regex = "^" + filter.regex;
                break;
        
            case "末尾":
                filter.regex = filter.regex + "$";
                break;
        }
    }

    const key = nanoid();

    chrome.storage.local.set({[key]: filter}, addFilterList(filter.type, filter.pattern, filter.text, key));
}

document.filterForm.submit.addEventListener("click", () => {
    if (!document.filterForm.text.value) return;
    
    addFilter();
    document.filterForm.text.value = "";
});

const remove_selectItems = document.getElementById("remove_selectItems");

remove_selectItems.addEventListener("click", removeFilter);

function removeFilter() {
    const result = window.confirm("選択したフィルターを削除しますか？");

    if (!result) return;

    const items = document.querySelectorAll(".form-check-input:checked");

    items.forEach(element => {
        chrome.storage.local.remove(element.value);
        element.parentNode.parentNode.remove();
    });
}