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
        let target = document.querySelector('.lst_event_box_left');
        if (index % 2) {
            target = document.querySelector('.lst_event_box_right');
        }
        const newLi = document.createElement('li');
        newLi.setAttribute('class', 'item');
        const newDiv1 = document.createElement('div');
        newDiv1.setAttribute('class', 'item_preview');
        const newImg1 = document.createElement('img');
        newImg1.setAttribute('alt', payload.items[index].productDescription);
        newImg1.setAttribute('class', 'img_thumb');
        newImg1.setAttribute('id', 'product_image_id_' + payload.items[index].productId);
        newImg1.setAttribute('src', '/static/' + payload.items[index].productImageUrl);

        const newSpan1 = document.createElement('span');
        newSpan1.setAttribute('class', 'img_border');
        newDiv1.appendChild(newImg1);
        newDiv1.appendChild(newSpan1);

        const newDiv2 = document.createElement('div');
        newDiv2.setAttribute('class', 'event_txt');
        const newH4 = document.createElement('h4');
        newH4.setAttribute('class', 'event_txt_tit');
        const newSpan2 = document.createElement('span');
        const newSpanTxt = document.createTextNode(payload.items[index].productDescription);
        newSpan2.appendChild(newSpanTxt);
        newH4.appendChild(newSpan2);
        const newSmall = document.createElement('small');
        newSmall.setAttribute('class', 'sm');
        newSmall.setAttribute('id', 'display_info_id_' + payload.items[index].productId);
        newH4.append(newSmall);

        const newP = document.createElement('p');
        newP.setAttribute('class', 'event_txt_dsc');
        const newPTxt = document.createTextNode(payload.items[index].productContent);
        newP.appendChild(newPTxt);

        newDiv2.appendChild(newH4);
        newDiv2.appendChild(newP);

        newLi.appendChild(newDiv1);
        newLi.appendChild(newDiv2);
        target.firstElementChild.appendChild(newLi);
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
    for (const item of list) {
        const newLi = document.createElement('li');
        newLi.setAttribute('class', 'promotion__list')
        newLi.setAttribute('style', 'background: url( "/static/' + item.productImageUrl + '" ); background-size: cover; ')
        target.appendChild(newLi);
    }
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
                showPromotions(promotionList.items)
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
    for (const item of lists) {
        const newLi = document.createElement('li');
        newLi.setAttribute('class', 'item');
        newLi.setAttribute('onclick', 'clearProducts({ category: ' + item.id + '})');
        const newA = document.createElement('a');
        newA.setAttribute('class', 'anchor');
        const newSpan = document.createElement('span');
        const newSpanTxt = document.createTextNode(item.name);
        newSpan.appendChild(newSpanTxt);
        newLi.appendChild(newSpan);
        target.appendChild(newLi);
    }
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