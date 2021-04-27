const ArithmaSlideWidget = (function () {
    let allPages;

    const ConfigMap = {
        scrollStopCheckTimeOut: 44
    }

    const _init = function (element) {

        //todo: generate only missing ones
        if (!ConfigMap.hasOwnProperty('cssAnimationOut') ||
            !ConfigMap.hasOwnProperty('cssAnimationIn')) {
            generateStandardCssAnimation();
        }

        if (element === null || element === undefined) {
            document.body.style.overflow = 'hidden';
            allPages = document.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(document.body);
        } else {
            let container = document.getElementById(element);
            container.style.overflow = 'hidden';
            allPages = container.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(container);
        }
    }

    const generateStandardCssAnimation = () => {
        let newStyle = document.createElement('style');
        newStyle.innerHTML = `.fullSlideOut{animation: fadeOut 0.8s forwards}.fullSlideIn{animation: fadeIn 0.8s forwards}` +
            `@keyframes fadeOut {0%{margin-top: 0;}100%{margin-top: -100vh;}}@keyframes fadeIn {0%{margin-top: -100vh;}100%{margin-top: 0;}}`;

        ConfigMap.cssAnimationOut = 'fullSlideOut';
        ConfigMap.cssAnimationIn = 'fullSlideIn';

        document.getElementsByTagName('head')[0].appendChild(newStyle);
    }

    const _getAllPages = function () {
        return allPages;
    }

    return {
        init: _init,
        getAllPages: _getAllPages,
        config: ConfigMap
    }
}());

ArithmaSlideWidget.ScrollHandler = (function () {
    let isScrolling = false;
    let scrollTimer;

    let pageIndex = 0;

    const _init = function (parent) {
        parent.addEventListener("wheel", MouseWheelHandler, {passive: false});
        if (parent !== document.body) {
            parent.onmouseover = ()=> document.body.style.setProperty('overflow','hidden','important');
            parent.onmouseout = ()=> document.body.style.removeProperty('overflow');
        }
    }

    const MouseWheelHandler = function (event) {
        if (!isScrolling){
            let previousPageIndex = pageIndex
            if (event.deltaY < 0) {
                slidePageUp();
            } else if (event.deltaY > 0) {
                slidePageDown();
            }
            if (ArithmaSlideWidget.config.hasOwnProperty('pageIndexCallback')) {
                ArithmaSlideWidget.config.pageIndexCallback(previousPageIndex, pageIndex);
            }
        }

        isScrolling = true;
        clearTimeout( scrollTimer );
        scrollTimer = setTimeout(function() {
            isScrolling=false;
        }, ArithmaSlideWidget.config.scrollStopCheckTimeOut);
    }

    //TODO: hoeveelheid wat gescrolled wordt aanpassen naarmate de grootte van de div
    const slidePageDown = function () {
        if (pageIndex < ArithmaSlideWidget.getAllPages().length - 1) {
            let previousPage = ArithmaSlideWidget.getAllPages()[pageIndex];
            pageIndex++;

            //removes if exists
            previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationOut);
            previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationIn);
            previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextIn);

            previousPage.classList.add(ArithmaSlideWidget.config.cssAnimationOut);

            if(ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextOut')){
                let nextPage = ArithmaSlideWidget.getAllPages()[pageIndex];
                nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextOut);
            }

            if(ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextIn')){
                previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextIn);

                let nextPage = ArithmaSlideWidget.getAllPages()[pageIndex];

                //removes if exists
                nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationIn);
                nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationOut);
                nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextIn);


                nextPage.classList.add(ArithmaSlideWidget.config.cssAnimationNextIn);
            }
        } else if (ArithmaSlideWidget.config.hasOwnProperty('noSlideDown')) {
            ArithmaSlideWidget.config.noSlideDown();
        }
    }

    const slidePageUp = function () {
        if (pageIndex !== 0) {

            let previousPage = ArithmaSlideWidget.getAllPages()[pageIndex];
            if (ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextOut')) {
                ArithmaSlideWidget.getAllPages()[pageIndex]
                    .classList.add(ArithmaSlideWidget.config.cssAnimationNextOut);
            }
            if (ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextIn')) {
                ArithmaSlideWidget.getAllPages()[pageIndex]
                    .classList.add(ArithmaSlideWidget.config.cssAnimationNextIn);
            }
            previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationIn);
            previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationOut);

            pageIndex--;
            let nextPage = ArithmaSlideWidget.getAllPages()[pageIndex];
            nextPage.classList.add(ArithmaSlideWidget.config.cssAnimationIn);
        } else if (ArithmaSlideWidget.config.hasOwnProperty('noSlideUp')) {
            ArithmaSlideWidget.config.noSlideUp();
        }
    }

    return {
        init: _init,
        triggerUp: slidePageUp,
        triggerDown: slidePageDown
    }
}());