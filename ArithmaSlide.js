const ArithmaSlideWidget = (function () {
    let allPages;
    let slideElement;
    const ConfigMap = {}

    const _init = function (element) {
        if (!ConfigMap.hasOwnProperty('cssAnimationOut') ||
            !ConfigMap.hasOwnProperty('cssAnimationIn')) {
            generateStandardCssAnimation(element);
        }
        slideElement = element;
        if (element === null || element === undefined) {
            document.body.style.overflow = 'hidden';
            allPages = document.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(document.body);
        } else {
            let container = document.getElementById(element)
            container.style.overflow = 'hidden';
            allPages = container.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(container);
        }
    }

    const refreshStyle = () => generateStandardCssAnimation(slideElement);

    const generateStandardCssAnimation = (element) => {
        let id = 'ArithmaSlideStyle';
        let height = "100vh";
        if(element !== null && element !== undefined) {
            height = document.getElementById(element). offsetHeight + "px";
        }
        let oldStyle = document.getElementById(id);
        if(oldStyle !== undefined && oldStyle !== null) oldStyle.parentNode.removeChild(element);

        let newStyle = document.createElement('style');
        newStyle.id = id;
        newStyle.innerHTML = `.fullSlideOut{animation: fadeOut 0.8s forwards}.fullSlideIn{animation: fadeIn 0.8s forwards}` +
            `@keyframes fadeOut {0%{margin-top: 0;}100%{margin-top: -${height};}}@keyframes fadeIn {0%{margin-top: -${height};}100%{margin-top: 0;}}`;

        ConfigMap.cssAnimationOut = 'fullSlideOut';
        ConfigMap.cssAnimationIn = 'fullSlideIn';

        document.getElementsByTagName('head')[0].appendChild(newStyle);
    }

    const _getAllPages = function () {
        return allPages;
    }

    const ScrollHandler = (function () {
        let isMoving = false;
        let isActive = true;
        let pageIndex = 0;

        const _init = function (parent) {
            parent.addEventListener("wheel", MouseWheelHandler, {passive: false});
            if (parent !== document.body) {
                parent.onmouseover = _mouseOverHandler;
                parent.onmouseout = _mouseOutHandler;
            }
        }

        const _mouseOverHandler = function (event) {
            event.preventDefault();
            isActive = true;
        }

        const _mouseOutHandler = function () {
            isActive = false;
        }

        const MouseWheelHandler = function (event) {
            if (isMoving || !isActive) return;
            event.preventDefault();
            isMoving = true;
            setTimeout(function () {
                isMoving = false;
            }, 2000);

            window.setTimeout(() => isMoving = false, 500);

            if (event.deltaY < 0) {
                slidePageUp();
            } else if (event.deltaY > 0) {
                slidePageDown();
            }
            if (ArithmaSlideWidget.config.hasOwnProperty('pageIndexCallback')) {
                ArithmaSlideWidget.config.pageIndexCallback(pageIndex);
            }
        }
        //TODO: hoeveelheid wat gescrolled wordt aanpassen naarmate de grootte van de div
        const slidePageDown = function () {
            if (pageIndex < ArithmaSlideWidget.getAllPages().length - 1) {
                let previousPage = ArithmaSlideWidget.getAllPages()[pageIndex];
                pageIndex++;

                if (previousPage.classList.contains(ArithmaSlideWidget.config.cssAnimationOut)
                    && previousPage.classList.contains(ArithmaSlideWidget.config.cssAnimationIn)) {
                    previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationOut);
                    previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationIn);
                }

                previousPage.classList.add(ArithmaSlideWidget.config.cssAnimationOut);

                if (ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextIn')) {
                    let nextPage = ArithmaSlideWidget.getAllPages()[pageIndex];

                    if (nextPage.classList.contains(ArithmaSlideWidget.config.cssAnimationNextOut)
                        && nextPage.classList.contains(ArithmaSlideWidget.config.cssAnimationNextIn)) {
                        nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextIn);
                        nextPage.classList.remove(ArithmaSlideWidget.config.cssAnimationNextOut);
                    }

                    nextPage.classList.add(ArithmaSlideWidget.config.cssAnimationNextIn);
                }
            } else if (ArithmaSlideWidget.config.hasOwnProperty('noSlideDown')) {
                ArithmaSlideWidget.config.noSlideDown();
            }
        }

        const slidePageUp = function () {
            if (pageIndex !== 0) {
                if (ArithmaSlideWidget.config.hasOwnProperty('cssAnimationNextOut')) {

                }

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
            triggerDown: slidePageDown,
            refreshStyle: refreshStyle
        }
    }());

    return {
        init: _init,
        getAllPages: _getAllPages,
        ScrollHandler: ScrollHandler,
        config: ConfigMap
    }
}());