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
    const alertContents = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const list = JSON.parse(httpRequest.responseText);
                const base = document.querySelector('#product__count');
                const count = document.createTextNode(list.totalCount + '개');
                if (base === null) {
                    console.log("again getProducts")
                    getProducts(payload);
                    return;
                    // base가 웹에 호출되는 시점이 매번 바뀌는 것을 관찰함
                    // 경우에따라 base가 null인데 접근하려는 시도가 있음.
                    // 이때 null을 참조하여 error가 발생하여, 이를 막는 코드임
                    // 비동기 처리를 이용하여 해결하는 방법이 있으줄로 알지만, 알아내지못하여 임시방편을 씀
                }
                if (!base.hasChildNodes()) {
                    base.appendChild(count);
                }
                showProducts(list);
            } else {
                console.log('request error');
            }
        }
    }
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('js.getProducts XMLHTTP error');
        return;
    }
    httpRequest.onreadystatechange = alertContents;
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
    const alertContents = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const promotionList = JSON.parse(httpRequest.responseText);
                const target = document.querySelector('#promotion__list');
                if (target === null) {
                    console.log("again getPromotions")
                    getPromotions();
                    return;
                }
                showPromotions(promotionList.items);
            } else {
                console.log('request error');
            }
        }
    }
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('XMLHTTP error');
    }
    httpRequest.onreadystatechange = alertContents;
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
        console.log(item);
        innerHTMLCategories += bindTemplate(item);
    }
    target.innerHTML = innerHTMLCategories;
}

const getCategories = () => {
    const alertContents = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const categoriesList = JSON.parse(httpRequest.responseText);
                const target = document.querySelector("#category__list");
                if (target === null) {
                    console.log("again getcategories")
                    getCategories();
                    return;
                }
                showCategories(categoriesList.items)
            } else {
                console.log('request error');
            }
        }
    }
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('XMLHTTP error');
    }
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', 'api/categories');
    httpRequest.send();
}

/**
<li class="item">
    <a href="detail.html?id=${id}" class="item_book">
        <div class="item_preview">
            <img alt="${description}" class="img_thumb" src="http://211.249.62.123/productImages/${id}?type=th">
            <span class="img_border"></span>
        </div>
        <div class="event_txt">
            <h4 class="event_txt_tit"> <span>${description}</span> <small class="sm">${placeName}</small> </h4>
            <p class="event_txt_dsc">${content}</p>
        </div>
    </a>
</li>
 */