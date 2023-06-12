$('.autoplay').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 483,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
  function inc() {
    let number = document.querySelector('[name="number"]');
    number.value = parseInt(number.value) + 1;
  }
  
  function dec() {
    let number = document.querySelector('[name="number"]');
      if (parseInt(number.value) > 0) {
        number.value = parseInt(number.value) - 1;
    }
  }
  
 $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:false,
    fade: false,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    centerMode: true,
    focusOnSelect: true
  });