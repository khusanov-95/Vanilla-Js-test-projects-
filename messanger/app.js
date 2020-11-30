// preloader will be here
const container = document.querySelector('.container');
    container.style.display = 'none';
    setTimeout(() => {
      container.style.display = 'block';
    },2000)

/*================Sign up/Log in toggle=========================*/

const signUpLink = document.querySelector('#sign-up-link');
const logInLink = document.querySelector('#log-in-link');
const signUpFormContainer = document.querySelector('.sign-up');
const logInFormContainer = document.querySelector('.log-in');
const userName = document.querySelector('#username');


function openForm(form,link){
  signUpFormContainer.classList.remove('active');
  logInFormContainer.classList.remove('active');
  signUpLink.classList.remove('active');
  logInLink.classList.remove('active');
  form.classList.add('active');
  link.classList.add('active');
}

// event listeners
signUpLink.addEventListener('click', () => {
  openForm(signUpFormContainer,signUpLink)
});
logInLink.addEventListener('click', () =>{
  openForm(logInFormContainer,logInLink)
});

/*================auth===================*/ 

// listen for  auth status changes
auth.onAuthStateChanged((user) => {
  if(user) {
    //if user exists hide the auth form and get user name from firestore
    document.querySelector('#auth').style.display ="none";
    const doc = db.collection('nicknames').doc(user.uid);
    doc.get().then(function(doc) {
      if (doc.exists) {
        userName.innerText = doc.data().nickname 
      } else {
        console.log('nothing')
      }
    });
  }
});

//Sign up
const signupForm = document.querySelector('#sign-up-form');

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  //get user info
  const email = signupForm.signupEmail.value;
  const password = signupForm.signupPassword.value;

  // get whole auth
  const authF = document.querySelector('#auth');

  //signup the user
  auth.createUserWithEmailAndPassword(email,password).then(cred => {
    //create a nickname
    return db.collection('nicknames').doc(cred.user.uid).set({
      nickname: signupForm.nickname.value
      
    })
  }).then(() => {
    signupForm.reset();
    authF.style.display = 'none';
    signupForm.querySelector('.err').innerHTML = '';
  }).catch(err => {
    //show error
    signupForm.querySelector('.err').innerHTML = err.message
  });
});

//Log in
const loginForm = document.querySelector('#log-in-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  //get user info
  const email = loginForm.loginEmail.value;
  const password = loginForm.loginPassword.value;

  
  // get whole auth
  const authF = document.querySelector('#auth');

  auth.signInWithEmailAndPassword(email,password).then(cred => {
    loginForm.reset();
    console.log(cred.user.email);
    authF.style.display = 'none';
    loginForm.querySelector('.err').innerHTML = '';
  }).catch(err => {
     //show error
    loginForm.querySelector('.err').innerHTML = err.message
  })
})

//logout 
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
  document.querySelector('#auth').style.display = 'flex';
})

/*================firestore DB===================*/ 
const chatArea = document.getElementById('chatArea');
const message = document.getElementById('message');
const form = document.getElementById('form');


// firebase collections
const chats = db.collection('chats');


//Get chats from db 
function getChats(){
  chats
  .orderBy('created_at')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type === 'added'){
        //update chat window
        updateChats(change.doc.data());
      }
    }); 
  });
  
}
//update chat in dom
function updateChats(data) {
  const time = dateFns.distanceInWordsToNow(
    data.created_at.toDate()
  )
  const msg = document.createElement('p');
  msg.innerHTML = `<span class="name">${data.username}: </span>${data.message} <span class="time">(${time})</span>`;
  chatArea.appendChild(msg);
}

//get all chats from db and add to dom
getChats();


//add new chat function
async function addChat(message) {

  //format a chat object
  const now = new Date();
  const chat = {
    message,
    username: userName.innerText, /* get name from nickname collection and add to chats collection */
    room: 'room1',
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };

  //save chat documents
  const response = await chats.add(chat);
  return response;
}


//Event Listeners

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(message.value != '') {
  //add chats to db
  addChat(message.value)
  .then(() => console.log('chat added'))
  .catch(err => console.log(err))
  }
  //clear the input val
  message.value = '';
  
});