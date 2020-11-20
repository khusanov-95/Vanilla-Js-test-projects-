const seats = document.querySelectorAll('.row .seat');
const loc = document.querySelector('#location');
const count = document.querySelector('#count');
const total = document.querySelector('#total');

populateUI();

price = +loc.value;

function setTicketData(ticketIndex, ticketPrice) {
  localStorage.setItem('ticketIndex', ticketIndex);
  localStorage.setItem('ticketPrice', ticketPrice);
}

function updateTotalSeatsAndPrice() {
  selectedSeats = document.querySelectorAll('.row .selected');
  count.innerText = selectedSeats.length;
  total.innerText = selectedSeats.length * price;
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  localStorage.setItem('seats', JSON.stringify(seatsIndex));
}
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('seats'));
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedLocIndex = localStorage.getItem('ticketIndex');
  console.log(selectedLocIndex);
  if (selectedLocIndex !== null) {
    loc.selectedIndex = selectedLocIndex;
  }
}

loc.addEventListener('change', (e) => {
  price = +e.target.value;
  setTicketData(e.target.selectedIndex, e.target.value);
  updateTotalSeatsAndPrice();
});

seats.forEach((seat) => {
  seat.addEventListener('click', () => {
    if (!seat.classList.contains('occupied')) {
      seat.classList.toggle('selected');
      updateTotalSeatsAndPrice();
    }
  });
});
updateTotalSeatsAndPrice();
