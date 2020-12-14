async function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();

  const email = profile.getEmail();
  const sendObj = {
    mail: email,
  };

  const response = await fetch('https://hostel-reservation.herokuapp.com/login/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendObj)
  });

  if (response.ok) {
    const userInfo = await response.json();
    const userId = userInfo.user_id;
    localStorage.setItem('userId', userId);
    router.redirectToBook();
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().catch(function () {
    console.log('User signed out.');
  });
}

function loaded() {
  const homeBtn = document.querySelector('.home-btn');
  homeBtn.click();
  console.log('hey');

  let link = document.createElement('a');
  link.href = '#';
  link.onclick = "signOut();";
  link.click();
  delete link;
}

const router = {
  redirectToLogIn: () => {
    const image = document.querySelector('.booking-img');
    image.classList.remove('hide');

    const bookingText = document.querySelector('.booking-text');
    bookingText.classList.add('hide');

    const bookingInfoContainer = document.querySelector('.booking-info-container');
    bookingInfoContainer.classList.add('hide');

    const homeComponent = document.querySelector('.home-component');
    const loginComponent = document.querySelector('.login-component');
    const bookComponent = document.querySelector('.booking-component');
    homeComponent.classList.add('hide');
    loginComponent.classList.remove('hide');
    bookComponent.classList.add('hide');

    const emailField = document.querySelector('.email');
    const passwordField = document.querySelector('.password');
    emailField.value = '';
    passwordField.value = '';
  },

  redirectToBook: () => {
    const image = document.querySelector('.booking-img');
    image.classList.remove('hide');

    const bookingText = document.querySelector('.booking-text');
    bookingText.classList.add('hide');

    const bookingInfoContainer = document.querySelector('.booking-info-container');
    bookingInfoContainer.classList.add('hide');

    const myRoomsContainer = document.querySelector('.my-rooms-container');
    myRoomsContainer.innerHTML = '';
    myRoomsContainer.classList.add('hide');

    const bookContainer = document.querySelector('.booking-container__main-container');
    bookContainer.classList.remove('hide');

    const homeComponent = document.querySelector('.home-component');
    const loginComponent = document.querySelector('.login-component');
    const bookComponent = document.querySelector('.booking-component');
    homeComponent.classList.add('hide');
    loginComponent.classList.add('hide');
    bookComponent.classList.remove('hide');
  },

  redirectToHome: () => {
    const image = document.querySelector('.booking-img');
    image.classList.remove('hide');

    const bookingText = document.querySelector('.booking-text');
    bookingText.classList.add('hide');

    const bookingInfoContainer = document.querySelector('.booking-info-container');
    bookingInfoContainer.classList.add('hide');

    const homeComponent = document.querySelector('.home-component');
    const loginComponent = document.querySelector('.login-component');
    const bookComponent = document.querySelector('.booking-component');
    homeComponent.classList.remove('hide');
    loginComponent.classList.add('hide');
    bookComponent.classList.add('hide');
  }
};

const LogInComponent = {
  handleLogin: async function () {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(mailformat)) {
      alert('Write correct Email!!!');
      return;
    }

    if (!email || !password) {
      alert('Email and password must be filled out!!!');
      return;
    }

    const logInInfo = {
      mail: email,
      password: password,
    };

    const response = await fetch('https://hostel-reservation.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logInInfo)
    });

    if (response.ok) {
      const userInfo = await response.json();
      const userId = userInfo.user_id;
      localStorage.setItem('userId', userId);
      router.redirectToBook();
    } else {
      alert("You are not registered!!!");
    }

  },

  handleRegistration: async () => {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(mailformat)) {
      alert('Write correct Email!!!');
      return;
    }

    if (!email || !password) {
      alert('Email and password must be filled out!!!');
      return;
    }

    const registrationInfo = {
      mail: document.querySelector('.email').value,
      password: document.querySelector('.password').value,
    };


    const response = await fetch('https://hostel-reservation.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationInfo)
    });

    if (response.ok) {
      alert('You are successfully registered!');
    } else {
      alert("You are already registered!!!");
    }
  },

}

const BookComponent = {
  showMyRooms: async () => {
    const bookContainer = document.querySelector('.booking-container__main-container');
    bookContainer.classList.add('hide');

    const myRoomsContainer = document.querySelector('.my-rooms-container');
    myRoomsContainer.classList.remove('hide');
    const userId = localStorage.getItem('userId');
    const response = await fetch(`https://hostel-reservation.herokuapp.com/rooms/${userId}`);
    const myRooms = await response.json();
    myRooms.forEach((room) => {
      BookComponent.createMyRoom(room.room, room.type, room.rental_id, room.floor, room.price, room.time_in, room.time_out);
    });
  },

  createMyRoom: (number, type, rentalId, floor, price, timeIn, timeOut) => {
    const roomContainers = Array.from(document.querySelectorAll('.my-room-container'));
    const existedRoom = roomContainers.find((room) => +room.dataset.number === +number);
    if (!existedRoom) {
      const myRoomContainer = document.createElement('div');
      myRoomContainer.classList.add('my-room-container');
      myRoomContainer.dataset.number = number;

      const numberInfo = document.createElement('div');
      numberInfo.classList.add('cancel-info');
      const roomNumber = document.createElement('p');
      roomNumber.innerText = `Room number: ${number}`;
      const roomFloor = document.createElement('p');
      roomFloor.innerText = `Floor: ${floor}`;
      numberInfo.appendChild(roomNumber);
      numberInfo.appendChild(roomFloor);
      myRoomContainer.appendChild(numberInfo);

      const dateInfo = document.createElement('div');
      dateInfo.classList.add('cancel-info');
      dateInfo.classList.add('date-info');
      const timeInInfo = document.createElement('p');
      timeInInfo.innerText = `Time in: ${timeIn}`;
      const timeOutInfo = document.createElement('p');
      timeOutInfo.innerText = `Time out: ${timeOut}`;
      dateInfo.appendChild(timeInInfo);
      dateInfo.appendChild(timeOutInfo);
      myRoomContainer.appendChild(dateInfo);

      const priceAndTypeInfo = document.createElement('div');
      priceAndTypeInfo.classList.add('cancel-info');
      const typeInfo = document.createElement('p');
      typeInfo.innerText = `Type: ${type}`;
      const priceInfo = document.createElement('p');
      priceInfo.innerText = `Price: ${price}`;
      priceAndTypeInfo.appendChild(typeInfo);
      priceAndTypeInfo.appendChild(priceInfo);
      myRoomContainer.appendChild(priceAndTypeInfo);

      const image = document.querySelector('.booking-img');
      image.classList.add('hide');

      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('strong-btn');
      cancelBtn.innerText = 'Cancel';
      cancelBtn.dataset.rentalId = rentalId;
      cancelBtn.dataset.number = number;

      cancelBtn.addEventListener('click', BookComponent.cancelBook);
      myRoomContainer.appendChild(cancelBtn);

      const myRoomsContainer = document.querySelector('.my-rooms-container');
      myRoomsContainer.appendChild(myRoomContainer);
    }
  },

  cancelBook: async function (event) {
    event.target.parentElement.remove();
    const rentalId = {
      rental_id: event.target.dataset.rentalId,
    };

    const response = await fetch('https://hostel-reservation.herokuapp.com/book', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rentalId),
    });

    if (response.ok) {
      const icons = Array.from(document.querySelectorAll('.room-icon'));
      const canceledRoom = icons.find((icon) => +icon.dataset.number === +event.target.dataset.number);
      canceledRoom.style.color = 'green';
      canceledRoom.addEventListener('click', BookComponent.showRoom);
    }
  },

  showBookContainer: () => {
    const image = document.querySelector('.booking-img');
    image.classList.add('hide');

    const bookingText = document.querySelector('.booking-text');
    bookingText.classList.remove('hide');

    const bookingInfoContainer = document.querySelector('.booking-info-container');
    bookingInfoContainer.classList.remove('hide');

    const myRoomsContainer = document.querySelector('.my-rooms-container');
    myRoomsContainer.classList.add('hide');
    myRoomsContainer.innerHTML = '';

    const bookContainer = document.querySelector('.booking-container__main-container');
    bookContainer.classList.remove('hide');
  },

  showRoom: function (event) {
    const modalRoom = document.querySelector('.modal-room-info-container');
    modalRoom.classList.add('show');

    const roomNumber = document.querySelector('.room-number-text');
    roomNumber.innerText = `Room number: ${event.target.dataset.number}`;
    const roomType = document.querySelector('.room-type-text');
    roomType.innerText = `Type: ${event.target.dataset.type}`;
    const img = document.querySelector('.booking-info-img');
    if (event.target.dataset.type === 'family') {
      img.setAttribute('src', './client/Images/Family room/family1.png');
    } else {
      img.setAttribute('src', './client/Images/Private room/bedroom2.png');
    }
    const roomCapacity = document.querySelector('.room-capacity-text');
    roomCapacity.innerText = `Capacity: ${event.target.dataset.capacity}`;
    const roomPrice = document.querySelector('.room-price-text');
    roomPrice.innerText = `Price: ${event.target.dataset.price}`;

    const bookBtn = document.querySelector('.booking-btn');
    bookBtn.dataset.number = event.target.dataset.number;
    bookBtn.addEventListener('click', BookComponent.bookRoom);
  },

  bookRoom: async function (event) {
    const roomNumber = event.target.dataset.number;
    const userId = localStorage.getItem('userId');
    const roomInfo = JSON.parse(localStorage.getItem('roomInfo'));
    const bookInfo = {
      user_id: userId,
      room_num: roomNumber,
      time_in: roomInfo.timeIn,
      time_out: roomInfo.timeOut,
    }

    const response = await fetch('https://hostel-reservation.herokuapp.com/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookInfo)
    });

    if (response.ok) {
      const icons = Array.from(document.querySelectorAll('.room-icon'));
      const bookedRoom = icons.find((icon) => +icon.dataset.number === +bookInfo.room_num);
      bookedRoom.style.color = 'red';
      bookedRoom.removeEventListener('click', BookComponent.showRoom);
      const modalRoom = document.querySelector('.modal-room-info-container');
      modalRoom.classList.remove('show');
    }
  },

  closeRoom: () => {
    const modalRoom = document.querySelector('.modal-room-info-container');
    modalRoom.classList.remove('show');
  },

  handleModal: async () => {
    const modal = document.querySelector('.modal');
    modal.classList.add('hide');
    const type = document.querySelector('.room-type').value;
    const departureTime = document.querySelector('.departure').value;
    const returnTime = document.querySelector('.return').value;
    const timeIn = document.querySelector('.timeIn').value;
    const timeOut = document.querySelector('.timeOut').value;
    console.log(!timeIn);
    console.log(!timeOut);

    if (!departureTime || !returnTime) {
      alert('Please, filled out all fields!!!');
      return;
    }

    if(!timeIn){
      alert('Please, filled out all fields!!!');
      return;
    }

    if(!timeOut) {
      alert('Please, filled out all fields!!!');
      return;
    }

    if (type != 'private' && type != 'family') {
      alert('In field type write private, if you want private room, else write family!!!');
      return;
    }

    const departureTimeArray = departureTime.split('-');
    const returnTimeArray = returnTime.split('-');
    for (let i = 0; i < departureTimeArray.length; i++) {
      if (+departureTimeArray[i] > +returnTimeArray[i]) {
        if (+departureTimeArray[0] < +returnTimeArray[0]) {
          break;
        } else {
          alert('You cannot come back before arrival! Please choose the correct departure and return date');
          return;
        }
      }
    }
    if (departureTime == returnTime) {
      const timeInArray = timeIn.split(':');
      const timeOutArray = timeOut.split(':');
      for (let i = 0; i < timeInArray.length; i++) {
        if (timeInArray[i] > timeOutArray[i]) {
          alert('You cannot come back before arrival! Please choose the correct departure and return time');
          return;
        }
      }
    }

    const roomInfo = {
      timeIn: document.querySelector('.departure').value + ` ${document.querySelector('.timeIn').value}`,
      timeOut: document.querySelector('.return').value + ` ${document.querySelector('.timeOut').value}`,
      type: type,
    }
    const response = await fetch(`https://hostel-reservation.herokuapp.com/book?time_in=${roomInfo.timeIn}&time_out=${roomInfo.timeOut}&type=${roomInfo.type}`);
    if (response.ok) {
      localStorage.setItem('roomInfo', JSON.stringify(roomInfo));
      const availableRoomsJson = await response.json();
      const availableRooms = Array.from(availableRoomsJson);
      console.log(availableRooms);
      const icons = Array.from(document.querySelectorAll('.room-icon'));
      if (roomInfo.type === 'family') {
        if (+icons[0].dataset.number === 1) {
          for (let i = 0; i < icons.length; i++) {
            icons[i].dataset.number = 13 + i;
          }
        }
      } else if (roomInfo.type === 'private') {
        if (+icons[0].dataset.number !== 1) {
          for (let i = 0; i < icons.length; i++) {
            icons[i].dataset.number = i + 1;
          }
        }
      }

      icons.forEach((icon) => {
        const room = availableRooms.find((room) => room.room_num === +icon.dataset.number);
        if (room != undefined) {
          icon.style.color = 'green';
          icon.dataset.type = roomInfo.type;
          if (roomInfo.type === 'family') {
            icon.dataset.price = 35;
            icon.dataset.capacity = 4;
          } else {
            icon.dataset.price = 20;
            icon.dataset.capacity = 2;
          }
          icon.addEventListener('click', BookComponent.showRoom);
        } else {
          icon.style.color = 'red';
          icon.removeEventListener('click', BookComponent.showRoom);
        }
      });

      modal.classList.remove('hide');
    }
  },

}

const ErrorComponent = {
  handleError: () => {
    const link = document.createElement('a');
    link.href = '#/login';
    link.click();
    delete link;
  },

  render: () => {
    return `
      <section class="error-section">
        <div class="error-container">
          <div class="error">
            <h1>You must log in before going to book page!!!</h1>
          </div>
          <button class="strong-btn error-btn" onclick="ErrorComponent.handleError()">Log in</button>
        </div>
      </section>
    `;
  }
}
