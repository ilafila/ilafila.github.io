
let map;
const coords = [];

function getCollisions(){
  const possibleCollisions = [{lat: 59.9419, lng: 30.2989, name: 'Глебася Глебасев', confirmed: true, time: '20:00:30'}, {lat: 59.93391, lng: 30.30647, name: 'Иван Иванов',
  confirmed: false, time: '21:30:00', }, {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},
  {lat: 58.9419, lng: 31.2989, name: 'Некий Алексей', confirmed: false, time: '20:00:30'},];
  handleCollisions(possibleCollisions);
}

function handleCollisions(possibleCollisions){
  for(let i = 0; i < possibleCollisions.length; i++){
    const possibleCollision = possibleCollisions[i];
    const {confirmed} = possibleCollision;
    if(confirmed){
      addCollisionOnMap(possibleCollision);
    }
    createTableNote(possibleCollision);
  }
}

function addCollisionOnMap(collisionInfo){
  const {lat, lng} = collisionInfo;
  const collisionCoords = {
    lat: lat,
    lng: lng,
  };
  coords.push(collisionCoords);
  initMap();
}

function createTableNote(note){
  const {lat, lng, name, confirmed, time} = note;
  const table = document.querySelector('.table-section__table-container__table');
  const collisionInfo = JSON.stringify({
    lat: lat,
    lng: lng,
  });

  const tableNote = document.createElement('tr');
  tableNote.innerHTML = ` <td>${name}</td>
                          <td>${lat}</td>
                          <td>${lng}</td>
                          <td>${time}</td> `;
  if(!confirmed){
    const confirmBox = `<td class="buttons">
                          <ion-icon class="confirm-icon" name="checkmark-circle-outline" onclick="confirmCollision()" data-collisionInfo=${collisionInfo}></ion-icon>
                          <ion-icon class="refuse-icon" name="close-circle-outline" onclick="refuseCollision()"></ion-icon>
                        </td>`;
    tableNote.insertAdjacentHTML('beforeend', confirmBox);
  }
  table.appendChild(tableNote);
}

function confirmCollision(){
  const collisionInfo = JSON.parse(event.currentTarget.dataset.collisioninfo);
  coords.push(collisionInfo);
  //прописать метод, который будет помечать столкновение подтвержденным на сервере
  event.currentTarget.parentElement.remove();
  initMap();
}

function refuseCollision(){
  event.currentTarget.parentElement.parentElement.remove();
  //прописать метод, который будет удалять столкновение из массива столкновений
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.57, lng: 30.19 },
    zoom: 8,
  });

  for (let i = 0; i < coords.length; i++) {
    const latLng = new google.maps.LatLng(coords[i].lat, coords[i].lng);
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    marker.addListener('click', () => {
      const infoWindow = new google.maps.InfoWindow();
      const position = {
        lat: coords[i].lat,
        lng: coords[i].lng,
      };
      infoWindow.setPosition(position);
      infoWindow.setContent(`Столкновение!`);
      infoWindow.open(map, marker);
      map.setCenter(position);
    })
  }
}

window.addEventListener('load', getCollisions);
