(() => {
    "use strict";
    window.addEventListener("load", (function(e) {
        let start, end, result, pos1, pos2, sliderWrapper = document.querySelector(".slider__wrapper"), wrapperWidth = window.getComputedStyle(sliderWrapper).width, offset = 0, touchStart = 0, arrOfTouches = [];
        function deleteTouches() {
            arrOfTouches = [];
            start = 0;
            end = 0;
        }
        const slides = document.querySelectorAll(".slider__slide"), homeButton = document.querySelector(".menu__home-link"), slidesField = document.querySelector(".slider__inner"), mainblockButton = document.querySelector(".mainblock__button");
        slidesField.style.width = 100 * slides.length + "%";
        slidesField.style.display = "flex";
        slidesField.style.transition = "0.7s all";
        sliderWrapper.style.overflow = "hidden";
        slides.forEach((slide => {
            slide.style.width = wrapperWidth;
        }));
        homeButtonPress();
        function homeButtonPress() {
            homeButton.addEventListener("click", (e => {
                e.preventDefault();
                slidesField.style.transform = `translateX(0px)`;
                offset = 0;
                deleteTouches();
            }));
        }
        mainblockButton.addEventListener("click", (e => {
            e.preventDefault();
            offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
            deleteTouches();
            slidesField.style.transform = `translateX(${offset}px)`;
            reCreateTouch();
        }));
        document.addEventListener("mousedown", (event => {
            pos1 = event.clientX;
            document.addEventListener("mousemove", swipeAction);
        }));
        function nextSlide() {
            if (offset == +wrapperWidth.slice(0, wrapperWidth.length - 2) * (slides.length - 1)) ; else offset += +wrapperWidth.slice(0, wrapperWidth.length - 2);
            slidesField.style.transform = `translateX(-${offset}px)`;
        }
        let swipeAction = function(e) {
            homeButtonPress();
            pos2 = e.clientX;
            result = pos2 - pos1;
            if (result < -300) {
                result = 0;
                nextSlide();
                document.removeEventListener("mousemove", swipeAction);
            } else if (result > 300) {
                console.log(result);
                if (0 == offset) offset = 0; else {
                    offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
                    deleteTouches();
                }
                slidesField.style.transform = `translateX(-${offset}px)`;
                document.removeEventListener("mousemove", swipeAction);
            }
        };
        document.addEventListener("mouseup", (() => {
            document.removeEventListener("mousemove", swipeAction);
        }));
        sliderWrapper.addEventListener("touchmove", touchMoveSlider);
        function touchMoveSlider(e) {
            touchStart = e.changedTouches[0].pageX;
            arrOfTouches.push(touchStart);
            start = arrOfTouches[0];
            end = arrOfTouches[arrOfTouches.length - 1];
            homeButtonPress();
            function sliderControl(touchStart, touchEnd) {
                if (touchEnd - touchStart > 300) {
                    if (0 == offset) offset = 0; else {
                        offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
                        deleteTouches();
                    }
                    slidesField.style.transform = `translateX(-${offset}px)`;
                    reCreateTouch();
                } else if (touchStart - touchEnd > 300) {
                    if (offset == +wrapperWidth.slice(0, wrapperWidth.length - 2) * (slides.length - 1)) ; else {
                        offset += +wrapperWidth.slice(0, wrapperWidth.length - 2);
                        deleteTouches();
                    }
                    slidesField.style.transform = `translateX(-${offset}px)`;
                    reCreateTouch();
                }
            }
            sliderControl(start, end);
        }
        function reCreateTouch() {
            sliderWrapper.removeEventListener("touchmove", touchMoveSlider);
            setTimeout((() => {
                sliderWrapper.addEventListener("touchmove", touchMoveSlider);
            }), 500);
        }
        window.addEventListener("resize", (function() {
            wrapperWidth = window.getComputedStyle(sliderWrapper).width;
            slides.forEach((slide => {
                slide.style.width = wrapperWidth;
            }));
        }));
    }));
    const script_scroll = document.querySelector(".body-textblock__scrollbar");
    const container = document.querySelector(".body-textblock");
    const content = document.querySelector(".body-textblock__text");
    const contentBody = document.querySelector(".textblock__body");
    let touchY;
    let containerHeight = 1.7 * container.clientHeight;
    content.addEventListener("scroll", (function(e) {
        script_scroll.style.top = containerHeight * content.scrollTop / content.scrollHeight + "px";
        script_scroll.style.height = container.clientHeight * content.clientHeight / content.scrollHeight / 2 + "px";
    }));
    let script_event = new Event("scroll");
    window.addEventListener("resize", content.dispatchEvent.bind(content, script_event));
    content.dispatchEvent(script_event);
    script_scroll.addEventListener("mousedown", (function(start) {
        start.preventDefault();
        let y = script_scroll.offsetTop;
        let onMove = function(end) {
            let delta = end.pageY - start.pageY;
            script_scroll.style.top = Math.min(containerHeight - script_scroll.clientHeight, Math.max(0, y + delta)) + "px";
            content.scrollTop = content.scrollHeight * script_scroll.offsetTop / containerHeight;
        };
        contentBody.addEventListener("mousemove", onMove);
        contentBody.addEventListener("mouseup", (function() {
            contentBody.removeEventListener("mousemove", onMove);
        }));
    }));
    let scrollTop;
    contentBody.addEventListener("touchstart", (() => {
        contentBody.addEventListener("touchmove", touchMoveScrollbar);
        function touchMoveScrollbar(e) {
            scrollTop = Math.round(script_scroll.style.top.slice(0, -2));
            touchY = e.touches[0].screenY;
            if (scrollTop < 0) {
                script_scroll.style.top = 0 + "px";
                scrollTop = 0;
            } else if (scrollTop >= 288) {
                scrollTop = 287;
                script_scroll.style.top = 287 + "px";
                contentBody.addEventListener("touchmove", touchMoveScrollbar);
            } else script_scroll.style.top = touchY - content.scrollHeight + 100 + "px";
            content.scrollTop = content.scrollHeight * script_scroll.offsetTop / containerHeight;
        }
    }));
    const callPopupButton = document.querySelector(".item-brend__button");
    const popup = document.querySelector(".brend__popup");
    const popupCloseButton = document.querySelector(".popup__close");
    const body = document.documentElement;
    callPopupButton.addEventListener("click", (function(e) {
        e.preventDefault();
        popup.classList.add("popup__show");
        body.classList.add("lock");
    }));
    popupCloseButton.addEventListener("click", (() => {
        closePopup();
    }));
    function closePopup() {
        if (body.classList.contains("lock")) {
            popup.classList.remove("popup__show");
            body.classList.remove("lock");
        }
    }
    document.addEventListener("click", (function(e) {
        if (body.classList.contains("lock") && !e.target.closest(".popup") && !e.target.closest(".item-brend__button")) closePopup();
    }));
    window.addEventListener("DOMContentLoaded", (function() {
        if (document.querySelector(".popup__slider")) {
            let offset = 0;
            let slideIndex = 1;
            const slides = document.querySelectorAll(".popup__list"), slider = document.querySelector(".popup__slider"), pagination = document.querySelector(".slider-popup-pagination"), prev = document.querySelector(".slider-popup-button__prev"), next = document.querySelector(".slider-popup-button__next"), slidesWrapper = document.querySelector(".popup__wrapper"), width = window.getComputedStyle(slidesWrapper).width, slidesField = document.querySelector(".popup__inner");
            slidesField.style.width = 100 * slides.length + "%";
            slidesField.style.display = "flex";
            slidesWrapper.style.overflow = "hidden";
            slides.forEach((slide => {
                slide.style.width = width;
            }));
            slider.style.position = "relative";
            const indicators = document.createElement("ol"), dots = [];
            indicators.classList.add("popup__pagination");
            indicators.style.cssText = `\n        display: flex;\n        justify-content: center;\n        margin-right: 15%;\n        margin-left: 15%;\n        list-style: none;\n    `;
            pagination.append(indicators);
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement("li");
                dot.setAttribute("data-slide-to", i + 1);
                dot.style.cssText = `\n            box-sizing: content-box;\n            flex: 0 1 auto;\n            width: 10px;\n            height: 10px;\n            border-radius: 50%;\n            margin-right: 3px;\n            margin-left: 3px;\n            cursor: pointer;\n            background: none;\n            border: 1px solid #000;\n            background-clip: padding-box;\n            transition: all 0.3s ease;\n        `;
                if (0 == i) {
                    dot.style.background = "#fc6da9";
                    dot.style.border = "1px solid #fc6da9";
                }
                indicators.append(dot);
                dots.push(dot);
            }
            next.addEventListener("click", (() => {
                if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) offset = 0; else offset += +width.slice(0, width.length - 2);
                slidesField.style.transform = `translateX(-${offset}px)`;
                if (slideIndex == slides.length) slideIndex = 1; else slideIndex++;
                dots.forEach((dot => {
                    dot.style.background = "none";
                    dot.style.border = "1px solid #000";
                }));
                dots[slideIndex - 1].style.background = "#fc6da9";
                dots[slideIndex - 1].style.border = "1px solid #fc6da9";
            }));
            prev.addEventListener("click", (() => {
                if (0 == offset) offset = +width.slice(0, width.length - 2) * (slides.length - 1); else offset -= +width.slice(0, width.length - 2);
                slidesField.style.transform = `translateX(-${offset}px)`;
                if (1 == slideIndex) slideIndex = slides.length; else slideIndex--;
                dots.forEach((dot => {
                    dot.style.background = "none";
                    dot.style.border = "1px solid #000";
                }));
                dots[slideIndex - 1].style.background = "#fc6da9";
                dots[slideIndex - 1].style.border = "1px solid #fc6da9";
            }));
            dots.forEach((dot => {
                dot.addEventListener("click", (e => {
                    const slideTo = e.target.getAttribute("data-slide-to");
                    slideIndex = slideTo;
                    offset = +width.slice(0, width.length - 2) * (slideTo - 1);
                    slidesField.style.transform = `translateX(-${offset}px)`;
                    dots.forEach((dot => {
                        dot.style.background = "none";
                        dot.style.border = "1px solid #000";
                    }));
                    dots[slideIndex - 1].style.background = "#fc6da9";
                    dots[slideIndex - 1].style.border = "1px solid #fc6da9";
                }));
            }));
        }
    }));
    const options = {
        threshold: 1
    };
    const observer = new IntersectionObserver(showSperms, options);
    const sperms = document.querySelectorAll(".textblock__bg");
    const textBlock = document.querySelectorAll(".body-textblock__text");
    textBlock.forEach((sperm => {
        observer.observe(sperm);
    }));
    function showSperms(entries, observer) {
        entries.forEach((entry => {
            if (entry.isIntersecting && 1 == entry.intersectionRatio) sperms.forEach((item => {
                item.classList.add("_active");
            })); else sperms.forEach((item => {
                item.classList.remove("_active");
            }));
        }));
    }
})();