login = function() {
    document.getElementById("error").innerText = "";
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error").innerText = error.message;
        }
    );
};

register = function() {
    document.getElementById("error").innerText = "";
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error").innerText = error.message;
        }
    );
};

logout = function() {
    firebase.auth().signOut();
};

(function(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            // Show logout, hide login/register
            document.getElementById("logout").style.display = "block";
            document.getElementById("login").style.display = "none";
            document.getElementById("register").style.display = "none";
        } else {
            // Show login/register, hide logout
            document.getElementById("logout").style.display = "none";
            document.getElementById("login").style.display = "block";
            document.getElementById("register").style.display = "block";
        }
    })
})()