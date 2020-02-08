const regBtn = document.querySelector('#reg-btn');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password_confirmation');
//errors messages 
const errorsMsgBox = document.querySelector('.errors-msg');
const userNameErrorMsg = document.querySelector('.username-error-msg');
const emailErrorMsg = document.querySelector('.email-error-msg');
const passwordErrorMsg = document.querySelector('.password-error-msg');
const password2ErrorMsg = document.querySelector('.password2-error-msg');

regBtn.addEventListener('click', (e) => {
  let messages = [];

  //username errors
  if (username.value === '' || username.value == null) {
    messages.push('用戶名 不能留空');
    userNameErrorMsg.innerText = '用戶名 不能留空';
  }else{
    userNameErrorMsg.innerText = '';
  }
  
  //email errors
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  if (email.value === '') {
    messages.push('信箱無效');
    emailErrorMsg.innerText = '信箱無效';
  }else if(emailRule.test(email.value) === false){
    messages.push('請輸入正確的Email格式');
    emailErrorMsg.innerText = '請輸入正確的Email格式';
  }else{
    emailErrorMsg.innerText = '';
  }
  

  //password errors
  if (password.value === '' || password.length < 6) {
    messages.push('密碼 至少要6個字元');
    passwordErrorMsg.innerText = '密碼 至少要6個字元';
  }else{
    passwordErrorMsg.innerText = '';
  }

//password2 errors
  if(password.value !== password2.value){
    messages.push('密碼 確認欄位的輸入並不相符');
    password2ErrorMsg.innerText = '密碼 確認欄位的輸入並不相符';
  }else{
    password2ErrorMsg.innerText = '';
  }
 

  if (messages.length > 0) {
    e.preventDefault();

    errorsMsgBox.innerHTML = `
    <div class="alert alert-danger">
      <h4>註冊失敗</h4>
    </div>
  `

  } else {
    errorsMsgBox.innerHTML = '';
    fetch('/users/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username.value,
        "email": email.value,
        "password": password.value,
        "password_confirmation": password2.value
      })
    })
    .then(response => {
      console.log(response)
      return response.json()
     })
    .then(res => {
       console.log(res)
       if(res.status === 'error'){
        errorsMsgBox.innerHTML =  `
            <div class="alert alert-danger">
               <h4>${res.errors}</h4>
             </div>
           `
           password.value = ''
           password2.value = ''
       }else{
         //因為用ajax post傳資料 後端不能用res.redirect('/login')
          window.location.assign('/users/login');
       }
     })
  }
});

