let productStartIndex = 0;

const clearProducts = (payload) => {
    productStartIndex = 0;
    document.querySelector('#load__more').style.visibility = "visible";
    document.querySelector('#product__count').innerHTML = '';
    document.querySelector('.lst_event_box_left').childNodes[1].innerHTML = '';
    document.querySelector('.lst_event_box_right').childNodes[1].innerHTML = '';
    document.querySelector('#load__more').setAttribute('onclick', 'getProducts( {category:' + payload.category + ' })')
    getProducts(payload);
}

const showProducts = (payload) => {
    for (let index = 0; index < 4; ++index) {
        if (++productStartIndex > payload.totalCount) {
            productStartIndex = 0;
            document.querySelector('#load__more').style.visibility = "hidden";
            return;
        }
        let target = document.querySelector('.lst_event_box_left').childNodes[1];
        if (index % 2) {
            target = document.querySelector('.lst_event_box_right').childNodes[1];
        }
        const template = document.querySelector('#productListTemplate').innerText;
        const bindProductList = Handlebars.compile(template);
        const res = bindProductList(payload.items[index]);
        let targetInnerHTML = target.innerHTML;
        targetInnerHTML += res;
        target.innerHTML = targetInnerHTML;
    }
}

const getProducts = (payload) => {
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('XMLHTTP error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const list = JSON.parse(httpRequest.responseText);
                const base = document.querySelector('#product__count');
                if (!base.hasChildNodes()) {
                    const count = document.createTextNode(list.totalCount + '개');
                    base.appendChild(count);
                }
                showProducts(list);
            }
        }
    };
    if (payload.category === 0) {
        httpRequest.open('GET', 'api/products?start=' + productStartIndex);
    } else {
        httpRequest.open('GET', 'api/products?categoryId=' + payload.category + '&start=' + productStartIndex);
    }
    httpRequest.send();
}

const showNextPromotion = () => {
    let promotionStartIndex = 0;

    setInterval(function() {
        const count = document.querySelector(".visual_img").childElementCount;
        const ul = document.querySelector('#promotion__list');
        ul.style.transition = '0.2s';
        ul.style.transform = "translate3d(-" + 400 * (promotionStartIndex + 1) + "px, 0px, 0px)";
        if (++promotionStartIndex === count - 1) {
            promotionStartIndex = -1;
        }
    }, 2000);
}

const showPromotions = (list) => {
    const target = document.querySelector('#promotion__list');
    const template = document.querySelector('#promotionListTemplate').innerText;
    const bindPromotionList = Handlebars.compile(template);
    let innerHTMLPromotion = '';
    for (const item of list) {
        innerHTMLPromotion += bindPromotionList(item);
    }
    target.innerHTML = innerHTMLPromotion;
}

const getPromotions = () => {
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('XMLHTTP error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const promotionList = JSON.parse(httpRequest.responseText);
                showPromotions(promotionList.items);
            }
        }
    };
    httpRequest.open('GET', 'api/promotions');
    httpRequest.send();
}

const showCategories = (list) => {
    const target = document.querySelector('#category__list');
    const lists = [{
            id: 0,
            name: '전체리스트'
        },
        ...list
    ]

    const template = document.querySelector('#categoriesListTemplate').innerText;
    const bindTemplate = Handlebars.compile(template);
    let innerHTMLCategories = '';
    for (const item of lists) {
        innerHTMLCategories += bindTemplate(item);
    }
    target.innerHTML = innerHTMLCategories;
}

const getCategories = () => {
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('XMLHTTP error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const categoriesList = JSON.parse(httpRequest.responseText);
                showCategories(categoriesList.items)
            }
        }
    };
    httpRequest.open('GET', 'api/categories');
    httpRequest.send();
}

const insertHTML = () => {
    const elementList = document.querySelectorAll('#insert-html');
    for (const element of elementList) {
        const file = element.getAttribute('insert-html');
        if (!file) continue
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) { element.innerHTML = this.responseText; }
                if (this.status === 404) { element.innerHTML = 'Page not found.'; }
                element.removeAttribute('insert-html');
                element.removeAttribute('id');
            }
        }
        httpRequest.open('GET', file, true);
        httpRequest.send();
    }
    getProducts({
        category: 0
    });
    getPromotions();
    getCategories();
    showNextPromotion();
};