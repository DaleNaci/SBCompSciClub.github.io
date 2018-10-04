let config = {
    apiKey: "AIzaSyCHpDKehgESGNKBQbFTJ3XOMea9vPZlV9I",
    authDomain: "pong-demo-csc.firebaseapp.com",
    databaseURL: "https://pong-demo-csc.firebaseio.com",
    projectId: "pong-demo-csc",
    storageBucket: "",
    messagingSenderId: "847028439876"
};
firebase.initializeApp(config);

let paddle = {
    x: canvas.width*0.35,
    y: canvas.height*0.90,
    w: canvas.width*0.3,
    h: canvas.height*0.05
};

let left = document.getElementsByClassName('left')[0];
let right = document.getElementsByClassName('right')[0];

let leftPressed = false;
let rightPressed = false;

left.addEventListener("mousedown", () => {
    leftPressed = true;
});

right.addEventListener("mousedown", () => {
    rightPressed = true;
});

window.addEventListener("mouseup", () => {
    leftPressed = false;
    rightPressed = false;
});


left.addEventListener("touchstart", () => {
    leftPressed = true;
});

right.addEventListener("touchstart", () => {
    rightPressed = true;
});

window.addEventListener("touchend", () => {
    leftPressed = false;
    rightPressed = false;
});

window.onload = () => {
    if(!firebase.auth().currentUser) {
        firebase.auth().signInAnonymously().catch(err => {
            location.reload();
        });
    }

};

window.onbeforeunload = function(){
   firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/active").set(false);
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref("users/"+user.uid+"/active").set(true);
    firebase.database().ref("users/"+user.uid+"/misses").once("value", snap => {
      if(!snap.val())
        firebase.database().ref("users/"+user.uid+"/misses").set(0);
    });
    init();
  } else {
      $('#setUpModal').modal('show');
    }
});

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);


    if(leftPressed)
        paddle.x-=0.01*canvas.width;
    if(rightPressed)
        paddle.x+=0.01*canvas.width;

    c.fillStyle = '#ffffff';
    c.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}


function init() {
    animate();
}

function start() {
    $('#setUpModal').modal('hide');
    firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/name").set(document.getElementById('nameId').value);
    init();
}
