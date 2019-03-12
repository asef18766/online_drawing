var socket=io.connect("http://localhost:8001");

socket.on('server_message', function(data){
    console.log("server:"+data.message);
    socket.emit('client_message',{message:'Hello server!'});
});

socket.on("verification",(data)=>{
    if(data)
    {
        socket.emit()
        window.location()
    }
    else
    {
        document.getElementById("verification").textContent="incorrect username or password,please register on if you need."
    }
})
function submit()
{
    var email=document.forms["user_id"]["email"].value;
    var passwd=document.forms["user_id"]["password"].value;

    socket.emit('user_verify',{email:email,passwd:passwd});
}