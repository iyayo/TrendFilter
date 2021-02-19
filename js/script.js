let filterList = undefined;
getAllFilter();

chrome.storage.onChanged.addListener(getAllFilter);

function getAllFilter() {
    chrome.storage.local.get(null, function (allItem) {
        filterList = allItem;
        hideTrend();
    })
}

function checkWordFilter(word) {
    for (let key in filterList) {
        if (filterList[key].type == "ワード") {
            let regex = new RegExp(filterList[key].regex);
    
            if (regex.test(word)) {
                return true;
            }
        }
    }

    return false;
}

function checkCategoryFilter(category) {
    for (let key in filterList) {
        if (filterList[key].type == "カテゴリー") {
            let regex = new RegExp(filterList[key].regex);

            if (regex.test(category)) {
                return true;
            }
        }
    }

    return false;
}

function hideTrend() {
    let trendList = document.querySelectorAll('[data-testid="trend"]');
    trendList.forEach(e => {
        /*
            trend
            0 = ランキング、カテゴリ
            1 = ワード
        */
        let trend = e.querySelectorAll("div.css-1dbjc4n.r-16y2uox.r-bnwqim > div");
        let cate = trend[0].querySelectorAll("span");
        let category = "";

        if (cate.length == 3){
            category = cate[2].innerText;
        } else if (cate.length == 1) {
            category = cate[0].innerText;
        }

        if ( checkWordFilter(trend[1].querySelector("span").innerText) && e.style.display != "none") {
            e.style.display = "none";
        }

        if ( checkCategoryFilter(category) && e.style.display != "none") {
            e.style.display = "none";
        }
    });

    let trendSuggest = document.querySelectorAll('div[role="listbox"] > div[role="option"] > div[role="button"] > div.css-1dbjc4n.r-1j3t67a.r-9qu9m4');
    trendSuggest.forEach(e => {
        let trend = e.querySelectorAll("span.css-901oao.css-16my406.r-bcqeeo.r-qvutc0");

        if (trend.length > 1) {
            if ( checkWordFilter(trend[0].innerText) && e.style.display != "none") {
                e.style.display = "none";
            }
        } 
    });
}

const observer = new MutationObserver(hideTrend);

const target = document.body;
const config = {
    subtree: true,
    childList: true,
    attributes: true
};

observer.observe(target, config);
