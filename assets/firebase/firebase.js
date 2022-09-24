//! ===== ===== ===== FIREBASE CONFIGURATION ===== ===== =====

const firebaseConfig = {
    apiKey: "AIzaSyAdecbimYBf_5RHGHpcAHUdaZ6qEBtr5I8",
    authDomain: "thefitness-c3075.firebaseapp.com",
    databaseURL: "https://thefitness-c3075-default-rtdb.firebaseio.com",
    projectId: "thefitness-c3075",
    storageBucket: "thefitness-c3075.appspot.com",
    messagingSenderId: "778258502057",
    appId: "1:778258502057:web:e91532f546e7be365334b8",
    measurementId: "G-HX9X64XGNE"
};


firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.database();
const ref = firebase.database().ref();
const firestore = firebase.firestore();
const usersRef = firebase.database().ref('users/');

//! ===== ===== ===== FIREBASE CONFIGURATION ===== ===== =====



//! ===== ===== ===== FIREBASE ACCOUNT ===== ===== =====

//* LOGIN WITH EMAIL AND PASSWORD
function FB_Login(email, password) {
    auth.signInWithEmailAndPassword(email, password).then(() => {
        console.log("login succeed")
        window.alert("login succeed")
    })
}

//* LOGIN WITH Element Class
function FB_LoginByClass(emailEle, passwordEle) {
    event.preventDefault()
    const email = document.querySelector(`${emailEle}`).value;
    const password = document.querySelector(`${passwordEle}`).value;
    FB_Login(email, password)
}

function FB_Register(username, email, password) {
    auth.createUserWithEmailAndPassword(email, password).then(() => {
        ref.child("count").once('value', (snapshot) => {
            const user = auth.currentUser;
            const count = snapshot.val();
            ref.update({
                count: count + 1
            }).then(() => {
                ref.child(`users/${user.uid}`).set({
                    username: username,
                    email: email,
                    password: password,
                    role: "member",
                    creation: Date.now(),
                    id: count + 1
                })
            })
        })
    }).catch((error) => {
        error(error.message)
    })
}

function FB_RegisterByClass(usernameEle, emailEle, passwordEle) {
    event.preventDefault()
    const username = document.querySelector(`${usernameEle}`).value;
    const email = document.querySelector(`${emailEle}`).value;
    const password = document.querySelector(`${passwordEle}`).value;
    FB_Register(username, email, password)
}

//! ===== ===== ===== FIREBASE ACCOUNT ===== ===== =====

//! ===== ===== ===== FIREBASE GENERAL ===== ===== =====

function realtimeAddDataForUser(data) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            ref.child(`users/${uid}/${data.path}`).set(data.values)
        }
    })
}

//! ===== ===== ===== FIREBASE GENERAL ===== ===== =====