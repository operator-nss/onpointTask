// slider
window.addEventListener("load", function (e) {
  let sliderWrapper = document.querySelector('.slider__wrapper'),
    wrapperWidth = window.getComputedStyle(sliderWrapper).width,
    offset = 0,
    touchStart = 0,
    arrOfTouches = [],
    start,
    end,
    result,
    pos1,
    pos2;

  function deleteTouches() {
    arrOfTouches = [];
    start = 0;
    end = 0;
  }

  const slides = document.querySelectorAll('.slider__slide'),
    homeButton = document.querySelector('.menu__home-link'),
    slidesField = document.querySelector('.slider__inner'),
    mainblockButton = document.querySelector('.mainblock__button');

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.7s all';
  sliderWrapper.style.overflow = 'hidden';
  slides.forEach(slide => {
    slide.style.width = wrapperWidth;
  });

  homeButtonPress();
  // Home button
  function homeButtonPress() {
    homeButton.addEventListener('click', (e) => {
      e.preventDefault();
      slidesField.style.transform = `translateX(0px)`;
      offset = 0;
      deleteTouches();
    });
  }

  // Mainblock button
  mainblockButton.addEventListener('click', (e) => {
    e.preventDefault();
    offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
    deleteTouches();
    slidesField.style.transform = `translateX(${offset}px)`;
    reCreateTouch();
  });


  //Swiper on mouse

  document.addEventListener('mousedown', (event) => {
    pos1 = event.clientX;
    document.addEventListener('mousemove', swipeAction);
  });

  function nextSlide() {
    if (offset == (+wrapperWidth.slice(0, wrapperWidth.length - 2) * (slides.length - 1))) {} else {
      offset += +wrapperWidth.slice(0, wrapperWidth.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
  }

  let swipeAction = function (e) {
    homeButtonPress();
    pos2 = e.clientX;
    result = pos2 - pos1;
    if (result < -300) {
      result = 0;

      nextSlide();
      document.removeEventListener('mousemove', swipeAction);
    } else if (result > 300) {
      console.log(result);

      if (offset == 0) {
        offset = 0;
      } else {
        offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
        deleteTouches();
      }
      slidesField.style.transform = `translateX(-${offset}px)`;
      document.removeEventListener('mousemove', swipeAction);
    }
  }

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', swipeAction);
  });



  //Swiper on touch

  sliderWrapper.addEventListener('touchmove', touchMoveSlider);

  function touchMoveSlider(e) {
    touchStart = e.changedTouches[0].pageX;
    arrOfTouches.push(touchStart);
    start = arrOfTouches[0];
    end = arrOfTouches[arrOfTouches.length - 1];

    homeButtonPress();

    function sliderControl(touchStart, touchEnd) {
      if ((touchEnd - touchStart) > 300) {
        if (offset == 0) {
          offset = 0;
        } else {
          offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
          deleteTouches();
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        reCreateTouch();

      } else if ((touchStart - touchEnd) > 300) {
        if (offset == (+wrapperWidth.slice(0, wrapperWidth.length - 2) * (slides.length - 1))) {} else {
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
    sliderWrapper.removeEventListener('touchmove', touchMoveSlider);
    setTimeout(() => {
      sliderWrapper.addEventListener('touchmove', touchMoveSlider);
    }, 500);
  }

  //  ReInit on resize
  window.addEventListener("resize", function () {
    wrapperWidth = window.getComputedStyle(sliderWrapper).width;
    slides.forEach(slide => {
      slide.style.width = wrapperWidth;
    });
  });

});

//========================================================================================================================================================

// Scrollbar

const scroll = document.querySelector('.body-textblock__scrollbar');
const container = document.querySelector('.body-textblock');
const content = document.querySelector('.body-textblock__text');
const contentBody = document.querySelector('.textblock__body');
let touchY;
let containerHeight = container.clientHeight * 1.7;

content.addEventListener('scroll', function (e) {
  scroll.style.top = containerHeight * content.scrollTop / content.scrollHeight + "px";
  scroll.style.height = container.clientHeight * content.clientHeight / content.scrollHeight / 2 + "px";
});

let event = new Event('scroll');
window.addEventListener('resize', content.dispatchEvent.bind(content, event));
content.dispatchEvent(event);

// Mouse scroll
scroll.addEventListener('mousedown', function (start) {
  start.preventDefault();
  let y = scroll.offsetTop;
  let onMove = function (end) {
    let delta = end.pageY - start.pageY;
    scroll.style.top = Math.min(containerHeight - scroll.clientHeight, Math.max(0, y + delta)) + 'px';
    content.scrollTop = (content.scrollHeight * scroll.offsetTop / containerHeight);
  };

  contentBody.addEventListener('mousemove', onMove);
  contentBody.addEventListener('mouseup', function () {
    contentBody.removeEventListener('mousemove', onMove);
  });
});


// Touch scroll
let scrollTop;

contentBody.addEventListener('touchstart', () => {
  contentBody.addEventListener('touchmove', touchMoveScrollbar)



  function touchMoveScrollbar(e) {

    scrollTop = Math.round(scroll.style.top.slice(0, -2));

    touchY = e.touches[0].screenY;


    if (scrollTop < 0) {
      scroll.style.top = 0 + 'px';
      scrollTop = 0;

    } else if (scrollTop >= 288) {
      scrollTop = 287;
      scroll.style.top = 287 + 'px';
      contentBody.addEventListener('touchmove', touchMoveScrollbar)

    } else {
      scroll.style.top = touchY - content.scrollHeight + 100 + 'px';
    }

    content.scrollTop = (content.scrollHeight * scroll.offsetTop / containerHeight);
  }


});
//========================================================================================================================================================

// Brend Popup

const callPopupButton = document.querySelector('.item-brend__button');
const popup = document.querySelector('.brend__popup');
const popupCloseButton = document.querySelector('.popup__close');
const body = document.documentElement;


callPopupButton.addEventListener("click", function (e) {
  e.preventDefault();
  popup.classList.add('popup__show');
  body.classList.add('lock');
});

popupCloseButton.addEventListener("click", () => {
  closePopup();
});

function closePopup() {
  if (body.classList.contains('lock')) {
    popup.classList.remove('popup__show');
    body.classList.remove('lock');
  }
}

// close popup on body
document.addEventListener("click", function (e) {
  if (body.classList.contains('lock') && !e.target.closest('.popup') && !e.target.closest('.item-brend__button')) {
    closePopup();
  }
});

//========================================================================================================================================================
// slider popup

window.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.popup__slider')) {
    let offset = 0;
    let slideIndex = 1;

    const slides = document.querySelectorAll('.popup__list'),
      slider = document.querySelector('.popup__slider'),
      pagination = document.querySelector('.slider-popup-pagination'),
      prev = document.querySelector('.slider-popup-button__prev'),
      next = document.querySelector('.slider-popup-button__next'),
      slidesWrapper = document.querySelector('.popup__wrapper'),
      width = window.getComputedStyle(slidesWrapper).width,
      slidesField = document.querySelector('.popup__inner');


    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
      slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
      dots = [];
    indicators.classList.add('popup__pagination');
    indicators.style.cssText = `
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    pagination.append(indicators);

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('li');
      dot.setAttribute('data-slide-to', i + 1);
      dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background: none;
            border: 1px solid #000;
            background-clip: padding-box;
            transition: all 0.3s ease;
        `;
      if (i == 0) {
        dot.style.background = '#fc6da9';
        dot.style.border = "1px solid #fc6da9"
      }
      indicators.append(dot);
      dots.push(dot);
    }

    next.addEventListener('click', () => {
      if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
        offset = 0;
      } else {
        offset += +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
        slideIndex = 1;
      } else {
        slideIndex++;
      }

      dots.forEach(dot => {
        dot.style.background = "none";
        dot.style.border = "1px solid #000"
      });
      dots[slideIndex - 1].style.background = '#fc6da9';
      dots[slideIndex - 1].style.border = "1px solid #fc6da9"
    });

    prev.addEventListener('click', () => {
      if (offset == 0) {
        offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
        offset -= +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
        slideIndex = slides.length;
      } else {
        slideIndex--;
      }


      dots.forEach(dot => {
        dot.style.background = "none";
        dot.style.border = "1px solid #000"
      });
      dots[slideIndex - 1].style.background = '#fc6da9';
      dots[slideIndex - 1].style.border = "1px solid #fc6da9"
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');

        slideIndex = slideTo;
        offset = +width.slice(0, width.length - 2) * (slideTo - 1);

        slidesField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => {
          dot.style.background = "none";
          dot.style.border = "1px solid #000";
        });
        dots[slideIndex - 1].style.background = '#fc6da9';
        dots[slideIndex - 1].style.border = "1px solid #fc6da9"

      });
    });
  }
});

//========================================================================================================================================================

// watch second slide


const options = {
  threshold: 1.0
};

const observer = new IntersectionObserver(showSperms, options);

const sperms = document.querySelectorAll('.textblock__bg');

const textBlock = document.querySelectorAll('.body-textblock__text');

textBlock.forEach((sperm) => {
  observer.observe(sperm);
});



function showSperms(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio == 1) {
      sperms.forEach(item => {
        item.classList.add('_active');
      })

    } else {
      sperms.forEach(item => {
        item.classList.remove('_active');
      })
    }
  });
}
