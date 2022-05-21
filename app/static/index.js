function game_start(){
    var username = $('#user_name').text();

    var send_data = {
        'username':username
    }

    $.ajax({
        url:'/game_start',
        type:'post',
        data:send_data,
        success:function (data){
            if(data.code==400){
                location.href = "/game_start_rel/"+data.username;
            }else{
                var next_message = document.querySelector('.next_message');
                next_message.className = 'next_message wrong';
                next_message.innerHTML = 'Please re-login';
            }
        }
    })
}