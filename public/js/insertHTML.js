 function insertHTML(callback) {
     var elementList, element, file, httpRequest;
     /*loop through a collection of all HTML elements:*/
     elementList = document.getElementsByTagName('*');
     for (let i = 0; i < elementList.length; i++) {
         element = elementList[i];
         /*search for elements with a certain atrribute:*/
         file = element.getAttribute('insert-html');
         //console.log(file);
         if (file) {
             /*make an HTTP request using the attribute value as the file name:*/
             httpRequest = new XMLHttpRequest();
             httpRequest.onreadystatechange = function() {
                 if (this.readyState === 4) {
                     if (this.status === 200) { element.innerHTML = this.responseText; }
                     if (this.status === 404) { element.innerHTML = 'Page not found.'; }
                     /*remove the attribute, and call this function once more:*/
                     element.removeAttribute('insert-html');
                     insertHTML(callback);
                 }
             }
             httpRequest.open('GET', file, true);
             httpRequest.send();
             /*exit the function:*/
             return;
         }
     }
     setTimeout(callback, 0);
 };