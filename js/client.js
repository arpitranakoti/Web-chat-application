//client side

const socket =io('http://localhost:8000');

const form=document.getElementById('send-container');
const messageInput=document.getElementById('msginput');
const messageDisplayContainer=document.querySelector('.container');

const append = (message , position)=>{
    const div_Element = document.createElement('div');
    div_Element.innerText=message;    // setting msg inside div
    div_Element.classList.add('message'); // <div class="message" > msg .... </div>
    div_Element.classList.add(position);  // <div class="message  {position} " > msg .... </div>
    messageDisplayContainer.append(div_Element);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();  // will not refersh page 
    const message=messageInput.value;
    append(`me : ${message}`,'right');
    socket.emit('send',message); // msg is send from client --> server 
    messageInput.value='';  // empty the input field for next msg 
})


const name = prompt("enter your name to join");

socket.emit('new-user-joined',name); // sending client(name) -->server 

socket.on('user-joined',name =>{   // here server --> all client (to avoid sending his name back we use broadcast )
 append(`${name} joined the chat`,'center')
 
})
socket.on('welcome', (message) => {
    append(message, 'center'); // Display the welcome message only to the new user
});

socket.on('receive',data =>{
    append(`${data.name} : ${data.message}`,'left')
   })

   socket.on('left',data =>{
    append(`${data.name} left the chat`,'center')
   })
