const slider = document.querySelector('#slider');
const sliderItems = slider.querySelectorAll('div');
const btnLeft = document.querySelector('.slider__nav-left');
const btnRight = document.querySelector('.slider__nav-right');

const arr = [...sliderItems];
let i = 0




function moveRigh(){
  arr.forEach(ar => {
    ar.classList.remove('active');
  })
  if(i >= arr.length -1) {
    i = 0;
  } else {
    i++
  }
    arr[i].classList.add('active');
    console.log(i);
}


function moveLeft(){
  arr.forEach(ar => {
    ar.classList.remove('active');
  })
  if(i <= 0) {
    i = arr.length -1;
  } else {
    i--
  }
    arr[i].classList.add('active');
    console.log(i)
}

//autoSlide
function autoSlider() {
  setInterval(() => {
    moveRigh()
  }, 5000);
}

// autoSlider();

//EventListeners 

btnRight.addEventListener('click', () => {
  moveRigh()
});

btnLeft.addEventListener('click', () => {
  moveLeft()
})

