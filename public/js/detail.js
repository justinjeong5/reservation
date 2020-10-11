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
    getDetail();

    nextSlides();
};

function getUrlParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}

const getDetail = () => {
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('XMLHTTP error');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                const list = JSON.parse(httpRequest.responseText);
                console.log(list)
            }
        }
    };
    httpRequest.open('GET', 'api/products/' + parseInt(getUrlParams().id));
    httpRequest.send();
}

let slideIndex = 0;

function nextSlides() {
    let slides = document.querySelectorAll('.mySlides');
    if (slides.length === 0) {
        setTimeout(() => {
            nextSlides();
        }, 200);
        return;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        slides[i].setAttribute('class', 'mySlides my__move__right')
    }
    slides[slideIndex].style.display = 'block';
    if (++slideIndex === slides.length) slideIndex = 0
}

function prevSlides() {
    let slides = document.querySelectorAll('.mySlides');

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        slides[i].setAttribute('class', 'mySlides my__move__left')
    }
    slides[slideIndex].style.display = 'block';
    if (--slideIndex === -1) slideIndex = slides.length - 1
}

const showDescription = () => {
    const getID = document.querySelector('#discription__roll');
    if (getID.style.height === '14px') {
        getID.style.height = '100%'
        document.querySelector('.button__description').innerText = '펼치기';
    } else {
        getID.style.height = '14px'
        document.querySelector('.button__description').innerText = '접기';
    }
}