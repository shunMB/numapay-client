'use strict';

const $ = e => document.getElementById(e);
const $$ = (e) => { const r = document.getElementsByClassName(e);return r[0]; }
const sendMessageButton = $('sendmessagebutton');
const subjectMaxLength = 50;
const commentMaxLength = 250;

const addClass = (node, className) => {
  let classNames = className.trim().split(/\s+/),
      nodeClass = (node.getAttribute('class') || '').trim(),
      nodeClassNames = nodeClass.split(/\s+/),
      i = classNames.length,
      classNameString;
  
  while (i--) {
    // 同名クラスがすでにあれば除く
    if (~nodeClassNames.indexOf(classNames[i])) {
      classNames.splice(i, 1);
    }
  }
  
  classNameString = classNames.join(' ');
  
  if (nodeClass.length) {
    // すでにクラスがあるときはハイフンでつなぐ
    if (classNameStr.length) {
      node.setAttribute('class', nodeClass + ' ' + classNameString);
    } else {
      node.setAttribute('class', nodeClass);
    }
  } else {
    node.setAttribute('class', classNameString);
  }
};


const removeClass = (node, className) => {
  let classNames = className.trim().split(/\s+/),
      nodeClass = (node.getAttribute('class') || '').trim(),
      nodeClassNames = nodeClass.split(/\s+/),
      i = nodeClassNames.length;
  
  while (i--) {
    // 指定したクラスがあれば削除
    if (~classNames.indexOf(nodeClassNames[i])) {
      nodeClassNames.splice(i, 1);
    }
  }
  
  node.setAttribute('class', nodeClassNames.join(' '));
};

const validateItem = (result, errorCondition, errorId, itemId, explanation) => {
    console.log("processing validateItem");
    if(errorCondition){
        $(errorId).innerHTML = `<i class="fa fa-exlamation-circle"></i> ${explanation}`;
        addClass($(itemId), 'input-error');
        return false;
    }else{
      return true;
    }

}

const validateSubmit = (txInfo) => {
    console.log("processing validateSubmit");
    let result = true;

    // エラー用装飾のためのクラスリセット
    removeClass($('send-to'),'input-error');
    removeClass($('token-amount'),'input-error');
    removeClass($('subject'),'input-error');
    removeClass($('comment'),'input-error'); 

    // 入力エラー文をリセット
    $("send-to-error").innerHTML = '';
    $("token-amount-error").innerHTML = '';
    $("subject-error").innerHTML = '';
    $("comment-error").innerHTML = '';

    //入力内容チェック
    result = validateItem(result, txInfo.sendTo === "", 'send-to-error', 'send-to','トークンの送付先を指定してください。');
    result = validateItem(result, txInfo.tokenAmount == 0, 'token-amount-error', 'token-amount','１以上のトークンの送付する量を指定してください。');
    result = validateItem(result, txInfo.subject == "", 'subject-error', 'subject','科目を入力してください。');
    result = validateItem(result, txInfo.subject.length > subjectMaxLength, 'subject-error', 'subject','科目は50文字以内で入力してください。');
    result = validateItem(result, txInfo.comment.length > commentMaxLength, 'comment-error', 'comment', 'コメントは250文字以内で入力してください。');

    console.log(`validation result:${result}`);
    return result;
};

// sendMessages call

const initializeApp = (data) => {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;
}

window.onload = (e) => {
    liff.init((data) => {
      initializeApp(data);
    });

    sendMessageButton.addEventListener('click', () => {

        const txInfo = {};
        let sendingPost;
        //フォームの入力を受け取って変数にセット
        txInfo.sendTo = (($('send-to')||{}).value)||"";
        txInfo.tokenAmount = ($('token-amount')||{}).value||0;
        txInfo.subject = (($('subject')||{}).value)||"";
        txInfo.comment = (($('comment')||{}).value)||"";

        if(validateSubmit(txInfo)){
            const select = document.querySelector('select');
            const sendToName = select.options[select.selectedIndex].textContents;
            // const sendToName = document.querySelector("[name='']").textContent;
            sendingPost = `
                送り先：${txInfo.sendTo + '-' + sendToName}\n
                額面：${txInfo.tokenAmount}\n
                科目：${txInfo.subject}\n
                // コメント：${txInfo.comment}\n
                `;
        }else{
            sendingPost = `異なるフォーマットです`;
        }
        liff.sendMessages([
          {
            type: 'text',
            text: sendingPost,
          }
        ]).then(() => {
            window.alert("sent message");
        }).catch( (error) => {
            window.alert("Error occured while sending message: " + error);
        });
    }); 
    
}


