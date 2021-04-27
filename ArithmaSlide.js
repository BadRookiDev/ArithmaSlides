const ArithmaSlideWidget = (function () {
    let allPages;
    let scrollHandler;

    const ConfigMap = {
        scrollStopCheckTimeOut: 44,
        slideOnGrab: false
    }

    function _init(element){

        //todo: generate only missing ones
        if (!ConfigMap.hasOwnProperty('cssAnimationOut') ||
            !ConfigMap.hasOwnProperty('cssAnimationIn')) {
            generateStandardCssAnimation();
        }

        scrollHandler = new ArithmaSlideScrollHandler(this);

        if (element === null || element === undefined) {
            document.body.style.overflow = 'hidden';
            allPages = document.querySelectorAll('.ArithmaSlide');
            scrollHandler.init(document.body);
        } else {
            let container = document.getElementById(element);
            container.style.overflow = 'hidden';
            allPages = container.querySelectorAll('.ArithmaSlide');
            scrollHandler.init(container);
        }
    }

    function generateStandardCssAnimation () {
        let newStyle = document.createElement('style');
        newStyle.innerHTML = `.fullSlideOut{animation: fadeOut 0.8s forwards}.fullSlideIn{animation: fadeIn 0.8s forwards}` +
            `@keyframes fadeOut {0%{margin-top: 0;}100%{margin-top: -100vh;}}@keyframes fadeIn {0%{margin-top: -100vh;}100%{margin-top: 0;}}`;

        ConfigMap.cssAnimationOut = 'fullSlideOut';
        ConfigMap.cssAnimationIn = 'fullSlideIn';

        document.getElementsByTagName('head')[0].appendChild(newStyle);
    }

    function _getAllPages() {
        return allPages;
    }

    function _getScrollHandler() {
        return scrollHandler;
    }

    return {
        init: _init,
        getAllPages: _getAllPages,
        config: ConfigMap,
        getScrollHandler: _getScrollHandler
    }
});

const ArithmaSlideScrollHandler = (function (aws) {
    let isScrolling = false;
    let scrollTimer;

    let pageIndex = 0;

    function _init (parent) {
        parent.addEventListener("wheel", MouseWheelHandler, {passive: false});
        if (parent !== document.body) {
            parent.onmouseover = ()=> document.body.style.setProperty('overflow','hidden','important');
            parent.onmouseout = ()=> document.body.style.removeProperty('overflow');
        }
    }

    function MouseWheelHandler (event) {
        if (!isScrolling){
            let previousPageIndex = pageIndex
            if (event.deltaY < 0) {
                slidePageUp();
            } else if (event.deltaY > 0) {
                slidePageDown();
            }
            if (aws.config.hasOwnProperty('pageIndexCallback')) {
                aws.config.pageIndexCallback(previousPageIndex, pageIndex);
            }
        }

        isScrolling = true;
        clearTimeout( scrollTimer );
        scrollTimer = setTimeout(function() {
            isScrolling=false;
        }, aws.config.scrollStopCheckTimeOut);
    }

    //TODO: hoeveelheid wat gescrolled wordt aanpassen naarmate de grootte van de div
    function slidePageDown() {
        if (pageIndex < aws.getAllPages().length - 1) {
            let previousPage = aws.getAllPages()[pageIndex];
            pageIndex++;

            //removes if exists
            previousPage.classList.remove(aws.config.cssAnimationOut);
            previousPage.classList.remove(aws.config.cssAnimationIn);
            previousPage.classList.remove(aws.config.cssAnimationNextIn);

            previousPage.classList.add(aws.config.cssAnimationOut);

            if(aws.config.hasOwnProperty('cssAnimationNextOut')){
                let nextPage = aws.getAllPages()[pageIndex];
                nextPage.classList.remove(aws.config.cssAnimationNextOut);
            }

            if(aws.config.hasOwnProperty('cssAnimationNextIn')){
                previousPage.classList.remove(aws.config.cssAnimationNextIn);

                let nextPage = aws.getAllPages()[pageIndex];

                //removes if exists
                nextPage.classList.remove(aws.config.cssAnimationIn);
                nextPage.classList.remove(aws.config.cssAnimationOut);
                nextPage.classList.remove(aws.config.cssAnimationNextIn);


                nextPage.classList.add(aws.config.cssAnimationNextIn);
            }
        } else if (aws.config.hasOwnProperty('noSlideDown')) {
            aws.config.noSlideDown();
        }
    }

    function slidePageUp () {
        if (pageIndex !== 0) {

            let previousPage = aws.getAllPages()[pageIndex];
            if (aws.config.hasOwnProperty('cssAnimationNextOut')) {
                aws.getAllPages()[pageIndex]
                    .classList.add(aws.config.cssAnimationNextOut);
            }
            if (aws.config.hasOwnProperty('cssAnimationNextIn')) {
                aws.getAllPages()[pageIndex]
                    .classList.add(aws.config.cssAnimationNextIn);
            }
            previousPage.classList.remove(aws.config.cssAnimationIn);
            previousPage.classList.remove(aws.config.cssAnimationOut);

            pageIndex--;
            let nextPage = aws.getAllPages()[pageIndex];
            nextPage.classList.add(aws.config.cssAnimationIn);
        } else if (aws.config.hasOwnProperty('noSlideUp')) {
            aws.config.noSlideUp();
        }
    }

    return {
        init: _init,
        triggerUp: slidePageUp,
        triggerDown: slidePageDown
    }
});
