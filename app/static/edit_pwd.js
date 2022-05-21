function un_check() {
    var name = document.getElementById("username").value;
    var un_message = document.querySelector('.un_message');
    if(name.length==0){
        un_message.className = 'un_message wrong';
        un_message.innerHTML = 'This field is empty';
    }else {
        un_message.className = 'un_message right';
        un_message.innerHTML = 'Correct';
    }
    var em_message = document.querySelector('.em_message');
    if(un_message.className == 'un_message right' && em_message.className == 'em_message right'){
        $('#next_but').attr('disabled',false);
        $('#next_but').attr('class','login_bt');
    }else{
        $('#next_but').attr('disabled',true);
        $('#next_but').attr('class','unclick_bt');
    }
}

function pwd_check() {
    var pwd = document.getElementById("email").value;
    var em_message = document.querySelector('.em_message');
    if(pwd.length!=0){
        em_message.className = 'em_message right';
        em_message.innerHTML = 'Correct';
    }else {
        em_message.className = 'em_message wrong';
        em_message.innerHTML = 'This field is empty';
    }
    var un_message = document.querySelector('.un_message');
    if(un_message.className == 'un_message right' && em_message.className == 'em_message right'){
        $('#next_but').attr('disabled',false);
        $('#next_but').attr('class','login_bt');
    }else{
        $('#next_but').attr('disabled',true);
        $('#next_but').attr('class','unclick_bt');
    }
}

function check_info(){
    var username = $('#username').val();
    var email = $('#email').val();
    var send_data = {
        'username':username,
        'email':email
    }

    $.ajax({
        url:'/check_exists',
        type:'post',
        data:send_data,
        success:function (data){
            if(data.code==400){
                location.href = "/edit_pwd_rel/"+data.id;
            }else{
                var next_message = document.querySelector('.next_message');
                next_message.className = 'next_message wrong';
                next_message.innerHTML = data.id;
            }
        }
    })
}

