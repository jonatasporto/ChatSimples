const socket = io();
let username='';
let userList = [];

let loginPage = document.querySelector("#loginPage");
let chatPage = document.querySelector("#chatPage");

let loginNameInput = document.querySelector("#loginNameInput");
let chatTextInput = document.querySelector("#chatTextInput");

loginPage.style.display = "flex";
chatPage.style.display = "none";

function renderUseList(){
    let ul = document.querySelector(".userList");
    ul.innerHTML = " ";

    userList.forEach(i=> {
        ul.innerHTML +='<li>'+i+'</li>';
    });
}

function addMsg(type,user,msg){
    let ul = document.querySelector(".chatList");

    switch(type){
        case 'status':
            ul.innerHTML += '<li class="m-status">'+msg+'</li>';
        break;
        case 'msg':
            if(username == user) {
                ul.innerHTML += '<li class="m-txt"><span class="me">'+user+': </span>'+msg+'</li>';
            }else{
                ul.innerHTML += '<li class="m-txt"><span>'+user+': </span>'+msg+'</li>';
            }
        break;
    }
    ul.scrollTop = ul.scrollHeight; //força rolagem automatica da barra de rolagem do chat
}

loginNameInput.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13){ //13 é a tecla enter
        let name = loginNameInput.value.trim();
        if(name != " "){
            username = name;
            document.title = "Bem-vindo ( "+username+" )";
            socket.emit("FalaComServidor",username);
        }
    }
});

chatTextInput.addEventListener('keyup',(e)=>{
    if (e.keyCode === 13){ //13 é a tecla enter
        let txt = chatTextInput.value.trim();
        chatTextInput.value ="";
       
        if(txt !=''){
            addMsg('msg',username,txt);
            socket.emit("send-msg",txt);
        }
    }
});

socket.on("user-ok",(list)=>{
    
    loginPage.style.display = "none";
    chatPage.style.display = "flex";

    chatTextInput.focus();

    addMsg('status',null,'Conectado!');

    userList = list;
    renderUseList();
});

socket.on('list-update',(data)=>{
    if(data.entrou){
        addMsg('status',null,data.entrou+' entrou no chat.');
    }
    if(data.saiu){
        addMsg('status',null,data.saiu+' saiu do chat.');
    }
    userList = data.list;
    renderUseList();

});


socket.on('show-msg',(data)=>{
    addMsg('msg',data.username, data.msg);
});

socket.on('disconnect',()=>{
    addMsg('status',null,'Servidor fora de operação');
    userList =[];
    renderUseList();
});

socket.on('reconnect_error',()=>{
    addMsg('status',null,'Tentando reconexão!!!');
});

socket.on('reconnect',()=>{
    addMsg('status',null,'Reconectado');
    if(username !=''){
        socket.emit('FalaComServidor',username);
    }
});


