const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
// Fetch and display previous messages when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  socket.emit('joinRoom', { username, room });

  socket.on('previousMessages', (messages) => {
    messages.forEach((message) => {
      outputMessage(message);
    });

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
});


socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.classList.add('join-msg')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    
    // Create an <i> element for the user icon
    const userIcon = document.createElement('i');
    userIcon.classList.add('fa', 'fa-regular', 'fa-user', 'fa-lg');
    userIcon.style.color = '#9ee6e6';
    userIcon.style.border = 'none';
    userIcon.style.backgroundColor = 'transparent';
    userIcon.style.boxShadow = 'none';
    userIcon.style.marginTop = '0';
    
    // Create a text node for the user's name
    const userName = document.createTextNode(user.username);
    
    // Append the user icon and user name to the <li> element
    li.appendChild(userIcon);
    li.appendChild(userName);
    
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
