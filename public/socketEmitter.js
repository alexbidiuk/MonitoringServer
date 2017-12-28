const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5Y2JjMTExOTRiMWM4NDcyMzg2Nzc5NCIsImRpc3BsYXlOYW1lIjoiYSIsImVtYWlsIjoiYWEiLCJpYXQiOjE1MDczMDQzODV9.8EJguN0Il8y7J0ED8FwrT0-dseT_8P3gZ7StmaEquZA";
const socket = io({ transports: ["websocket"] });



const handler = () => {
  socket.on('connect', function () {
    socket
    .emit('authenticate', {token: jwt})
    .on('authenticated', function () {
      socket.emit("clientEvent", "Я отослал свой токен и прошел авторизацию");
    })
    .on('unauthorized', function(msg) {
      console.log("unauthorized: " + JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })
    .on('call', function(msg) {
      console.log(msg);
    })
  });
  
};

const groupCallEvent = (groupId, objectId) => {
    socket.emit('groupCall',{
        groupId: groupId,
        objectId: objectId
    });
};

//mockup
const groupCallMockuped = (number) => {
  let groupId;
  let objectId;
  switch(number) {
    case 0:
      groupId = '59d37d9e21fe42268c4e52ee';
      objectId = '59e4c2846419402b7095d2be';
      break;
    case 1:
      groupId = '59d37d9e21fe42268c4e52ee';
      objectId = '59e4c2846419402b7095d2bf';
      break;
    case 2:
      groupId = '59d37d9e21fe42268c4e52ee';
      objectId = '59e4c2846419402b7095d2c0';
      break;
  }
  groupCallEvent(groupId, objectId);
};


document.addEventListener("DOMContentLoaded", handler);
let button0 = document.getElementById('callgroup0');
let button1 = document.getElementById('callgroup1');
let button2 = document.getElementById('callgroup2');
button0.onclick = () => groupCallMockuped(0);
button1.onclick = () => groupCallMockuped(1);
button2.onclick = () => groupCallMockuped(2);
