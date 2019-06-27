
(function () {  //method from: https://community.canvaslms.com/thread/22500-mobile-javascript-development
    
    /* 
     * Function to work out when the DOM is ready: https://stackoverflow.com/questions/1795089/how-can-i-detect-dom-ready-and-add-a-class-without-jquery/1795167#1795167 
     * and fire off ou_domReady
     */
    // Mozilla, Opera, Webkit 
    if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", function(){
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
            ou_domReady();
        }, false );
    // If IE event model is used
    } else if ( document.attachEvent ) {
        // ensure firing before onload
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", arguments.callee );
                ou_domReady();
            }
        });
    }
    
    var h2MenuItems = [];
    var h2IdCounter = 0;
    var divUserContent;
    var scrollNav;
    var scrollMenuButton;
    
    /* Wait until DOM ready before processing */
    function ou_domReady () {
        setTimeout(function(){ 
            divUserContent = document.querySelector('div.show-content.user_content'); 
            ou_getH2s();
        }, 500);
    }

    /* see: https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib */
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    
    

    /* Het h2 children of div.show-content.user_content */
    function ou_getH2s() {
        if(divUserContent) {
            var h2s = divUserContent.getElementsByTagName('h2');
            if(h2s.length > 0) {
                ou_addIdsIfNecessary(h2s);
            }
        }
        else {
            console.log('no user content');
        }
    }

    function ou_addIdsIfNecessary(h2s) {
        /* need this syntax because an array-like object */
        Array.prototype.forEach.call(h2s, h2 => {
            if(h2.innerText && h2.innerText != ""){
                if(!h2.id || h2.id == "") {
                    h2.id = "ou_scroll_id_" + h2IdCounter;
                    h2IdCounter++;
                } 
                var h2MenuItem = {
                    text: h2.innerText,
                    target: h2.id
                }
                h2MenuItems.push(h2MenuItem);
            }
          });
        if(h2MenuItems.length > 0){
            ou_createMenu(h2MenuItems);
        }
        
    }

    function ou_createMenu(h2MenuItems) {
        if(divUserContent) {
            
            scrollNav = document.createElement("nav");
            scrollNav.id = "ou_scroll-nav";
            scrollNav.className = "ou_scroll-nav";

            var h1PageTitle = divUserContent.getElementsByTagName('h1')[0];

            insertAfter(scrollNav,h1PageTitle);

            scrollList = document.createElement("ul");
            scrollList.className = "ou_scroll-nav__list";

            h2MenuItems.forEach(function(h2MenuItem){
                scrollListItem = document.createElement("li");
                scrollListItem.className = "ou_scroll-nav__item";
                
                scrollListItemLink = document.createElement("a");
                scrollListItemLink.href = "#" + h2MenuItem.target;
                scrollListItemLink.text = h2MenuItem.text;
                scrollListItemLink.className = "ou_scroll-nav__link";

                scrollListItem.appendChild(scrollListItemLink);
                scrollList.appendChild(scrollListItem);
            });  

            scrollNav.appendChild(scrollList);
            br = document.createElement("br");
            scrollNav.appendChild(br);

            scrollMenuButton = document.createElement("a");
            scrollMenuButton.title = "Back to top";
            //scrollMenuButton.innerHTML = '<i class="icon-arrow-up" aria-hidden="true"></i>';

            scrollMenuButtonArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            scrollMenuButtonArrow.setAttribute('width','18');
            scrollMenuButtonArrow.setAttribute('height','18');
            scrollMenuButtonArrow.setAttribute('viewbox','0 0 612 612');
            scrollMenuButtonArrow.className = 'ou_scroll-nav__arrow';
            scrollMenuButton.appendChild(scrollMenuButtonArrow);
            
            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform','scale(0.03)');
            scrollMenuButtonArrow.appendChild(group);
            
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d','M604.501,440.509L325.398,134.956c-5.331-5.357-12.423-7.627-19.386-7.27c-6.989-0.357-14.056,1.913-19.387,7.27L7.499,440.509c-9.999,10.024-9.999,26.298,0,36.323s26.223,10.024,36.222,0l262.293-287.164L568.28,476.832c9.999,10.024,26.222,10.024,36.221,0C614.5,466.809,614.5,450.534,604.501,440.509z');
            path.setAttribute('fill','#2d3b45');
            group.appendChild(path);
            
            scrollMenuButton.className = "ou_scroll_menu_button toggle-content";
            scrollMenuButton.href = "#ou_scroll-nav";
            divUserContent.prepend(scrollMenuButton);
        }
    }

    /* adpted from: https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/ */
    var isNotScrolledBelow = function (elem) {
        var bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0
        );
    };

    // Show an element: https://gomakethings.com/how-to-show-and-hide-elements-with-vanilla-javascript/
    var show = function (elem) {
        elem.classList.add('is-visible');
    };

    // Hide an element
    var hide = function (elem) {
        elem.classList.remove('is-visible');
    };

    // Toggle element visibility
    var toggle = function (elem) {
        elem.classList.toggle('is-visible');
    };

    window.addEventListener('scroll', function (event) {
        if(scrollNav) {
            if (isNotScrolledBelow(scrollNav)) {
                hide(scrollMenuButton);
            } else {
                show(scrollMenuButton);
            } 
        }
    }, false);



    /* h5P resizing script */
    var h5pScript = document.createElement('script');
    h5pScript.setAttribute('charset', 'UTF-8');
    h5pScript.setAttribute('src', 'https://h5p.com/canvas-resizer.js');
    document.body.appendChild(h5pScript);

    

})();