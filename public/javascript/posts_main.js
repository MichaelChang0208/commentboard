
//動態生成新留言
var submitBtn = document.querySelector('.submit');
var newPostUserName = document.querySelector('.newpost-username');
var textarea = document.querySelector('#textarea');

let today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const hour = today.getHours();
const minute = today.getMinutes();
const second = today.getSeconds();
const finalTime = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
//這裡判斷是否有這個按鈕 ， 不然控制台會報錯
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
 
    //textarea.value 避免content沒內容 還一直按送出留言
    if (textarea.value) {
      fetch('/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "author": newPostUserName.innerText,
          "content": textarea.value,
          "time": finalTime
        })
      })
        .then(res => res.json())
        .then(response => {
         console.log(response)
         const posts = document.querySelector('.posts');
         const newpost = document.createElement('div');
         newpost.classList.add('card');
          const item = `
            <div class="card-header posts-header-flex">
              <h3 class="card-title ">${response.author}</h3> 
              <div class="posts-UD-box">
                <button class="posts-update-ajax" data-id="${response._id}">編輯</button>
                <button class="posts-delete-ajax" data-id="${response._id}">刪除</button>         
              </div>
            </div>
            <div class="card-body">
              <div class="card-body-content">${response.content}</div>
              <textarea class="edit-content update-hide" name="content" cols="30" rows="5" maxlength="100" ></textarea>
              <button class="edit-btn update-hide" data-id="${response._id}">送出</button> 
            </div>
            <div class="posts-time">${response.time}</div>
          `
        
    
        newpost.innerHTML = item;
        //要新增在最'下'面用append
        // posts.append(newpost);
        //要新增在最'上'面用prepend 原生js用insertBefore
        posts.insertBefore(newpost,posts.firstChild)
        newpost.querySelector('.posts-delete-ajax').addEventListener('click', deleteItem)
        newpost.querySelector('.posts-update-ajax').addEventListener('click', updateItem)
        //清空發表新留言欄位的值
        textarea.value = '';

        }).catch(err => console.log(`${err} 新增留言失敗`));

    }
  });
}
function deleteItem(e){
   //取到每一個的_id 再用fetch傳送request 到後端
   const id = e.target.getAttribute('data-id');

   fetch(`/posts/delete/${id}`,{
     method:'delete'
   }).then(data => data.json())
     .then(res=> {
       if(res.status === 'SUCCESS'){
         const targetParent = e.target.parentElement.parentElement.parentElement;
         targetParent.remove();
       }else{
         alert('刪除失敗');
       }
      
     })
}
//delete fetch
const deleteBtns = document.querySelectorAll('.posts-delete-ajax');

if(deleteBtns){
  for(const btn of deleteBtns){
    btn.addEventListener('click', (e) => {
      deleteItem(e);
    });
  }
}
  

function updateItem(e){
  const targetCard = e.target.parentElement.parentElement.parentElement;
  console.log(targetCard)
  let oldContent = targetCard.querySelector('.card-body-content');
  let newContent = targetCard.querySelector('.edit-content');
  const editBtn =  targetCard.querySelector('.edit-btn');
  newContent.classList.remove('update-hide');
  editBtn.classList.remove('update-hide');
  oldContent.classList.add('update-hide');
  newContent.value = oldContent.innerText;

  editBtn.addEventListener('click', (e) => {
    //取到每一個的_id 再用fetch傳送request 到後端
    const update_id = e.target.getAttribute('data-id');
    console.log(update_id)
    fetch(`/posts/put/${update_id}`,{
      method:'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "content": newContent.value,
      })
    }).then(data => data.json())
      .then(res=> {
        if(res.status === 'SUCCESS'){
          console.log(res.data)
          oldContent.innerText = res.data;
          newContent.classList.add('update-hide'); 
          oldContent.classList.remove('update-hide');
          editBtn.classList.add('update-hide');
        }else{
          alert('更新失敗');
        }
      })
  });
}
//update fetch
const updateBtn = document.querySelectorAll('.posts-update-ajax');
if(updateBtn){
  for(const upbtn of updateBtn){
    upbtn.addEventListener('click', (e) => {
      updateItem(e);
    });
  }
  
}