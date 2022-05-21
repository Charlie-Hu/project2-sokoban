function pwd_check() {
    var pwd = $('#password').val();
    var re_pwd = $('#re_password').val();

    var em_message = document.querySelector('.em_message');
    if(pwd.length!=0 && re_pwd.length!=0 && pwd==re_pwd){
        $('#next_but').attr('disabled',false);
        $('#next_but').attr('class','login_bt');
        em_message.className = 'em_message right';
        em_message.innerHTML = 'Correct';
    }else {
        em_message.className = 'em_message wrong';
        em_message.innerHTML = 'The passwords entered twice are different';
        $('#next_but').attr('disabled',true);
        $('#next_but').attr('class','unclick_bt');
    }
}

function check_info(){
    var id_val = $('#id_val').text();
    var pwd = $('#password').val();
    var send_data = {
        'id':id_val,
        'pwd':pwd
    }

    $.ajax({
        url:'/update_password',
        type:'post',
        data:send_data,
        success:function (data){
            if(data.code==400){
                location.href = "/login";
            }else{
                var next_message = document.querySelector('.next_message');
                next_message.className = 'next_message wrong';
                next_message.innerHTML = data.id;
            }
        }
    })
}

