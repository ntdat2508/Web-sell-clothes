
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
  
