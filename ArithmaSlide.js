const ArithmaSlideWidget = (function() {
    let allPages;

    let ConfigMap = {

    }

    const _init = function (){
        if (!ConfigMap.hasOwnProperty('cssAnimationOut')||
        !ConfigMap.hasOwnProperty('cssAnimationIn')){
            generateStandardCssAnimation();
        }

        if (!ConfigMap.hasOwnProperty('container')){
            document.body.style.overflow = 'hidden';
            allPages = document.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(document.body);
        } else {
            let container = document.getElementById(ConfigMap.container)
            container.style.overflow = 'hidden';
            allPages = container.querySelectorAll('.ArithmaSlide');
            ArithmaSlideWidget.ScrollHandler.init(container);
        }
    }

    function generateStandardCssAnimation(){
        let keyframes = '@keyframes fadeOut {\n' +
            '    0%{\n' +
            '        margin-top: 0;\n' +
            '    }\n' +
            '    100%{\n' +
            '        margin-top: -100vh;\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '@keyframes fadeIn {\n' +
            '    0%{\n' +
            '        margin-top: -100vh;\n' +
            '    }\n' +
            '    100%{\n' +
            '        margin-top: 0;\n' +
            '    }\n' +
            '}';

        let style = document.createElement('style');
        style.innerHTML = '\n.fullSlideOut{animation: fadeOut 0.8s forwards}' +
            '\n.fullSlideIn{animation: fadeIn 0.8s forwards}\n'+
            keyframes;

        ConfigMap.cssAnimationOut ='fullSlideOut';
        ConfigMap.cssAnimationIn ='fullSlideIn';

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    const _getAllPages = function (){
        return allPages;
    }

    return {
        init: _init,
        getAllPages:  _getAllPages,
        config: ConfigMap
    }
}());



////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////



ArithmaSlideWidget.ScrollHandler = (function() {
    let isMoving = false;
    let pageIndex = 0;

    const _init = function (parent){
        parent.addEventListener("wheel", MouseWheelHandler);
        function MouseWheelHandler(event) {

            if (isMoving) return;
            isMoving = true;
            setTimeout(function() {
                isMoving=false;
            },2000);

            if (event.deltaY < 0)
            {
                slidePageUp();
            }
            else if (event.deltaY > 0)
            {
                slidePageDown();
            }
            if (ArithmaSlideWidget.config.hasOwnProperty('pageIndexCallback')){
                ArithmaSlideWidget.config.pageIndexCallback(pageIndex);
            }
        }
    }

    const slidePageDown = function (){
        if (pageIndex<ArithmaSlideWidget.getAllPages().length-1) {
            let previousPage = ArithmaSlideWidget.getAllPages()[pageIndex];
            pageIndex++;

            if (previousPage.classList.contains(ArithmaSlideWidget.config.cssAnimationOut)
                &&previousPage.classList.contains(ArithmaSlideWidget.config.cssAnimationIn)){
                previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationOut);
                previousPage.classList.remove(ArithmaSlideWidget.config.cssAnimationIn);
            }

            previousPage.classList.add(ArithmaSlideWidget.config.cssAnimationOut);
        } else if (ArithmaSlideWidget.config.hasOwnProperty('noSlideDown')) {
            ArithmaSlideWidget.config.noSlideDown();
        }
    }

    const slidePageUp = function (){
        if (pageIndex!==0) {
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