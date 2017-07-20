# Firebase Tutorial
In this tutorial we will build a simple application that uses Firebase Authentication and Database.

## Intro
The project that we are going to be working on is a simple game database system. 
Checkout the game here: before getting started for context.

Here are the requirements:
* [Authentication] Players can login/create an account/log out
* [Adding data] Players can add a new musical box
* [Updating data] Making changes to a musical box automatically saves
* [Data retrieval] Players can see all of the musical boxes
* [Data security] Anyone can see all of the musical boxes, but players can only write the ones they own

We will tackle each requirement separately

## Prereqs
* [Http-server](https://www.npmjs.com/package/http-server) (or any other static file server)
* [Firebase account](console.firebase.google.com)

Go ahead and create a project in your firebase account for this tutorial. You will need this for the auth tolkens

## [Part1] Authentication

Each player should be able to log into the game. To do this we will use firebase auth (:

The firebase auth api lets us register users with email and password (other options also available), and then login using those credentials.
Once a user is created, they are automatically assigned a unique uid.

### [Part1-1] Basic form

Let's go ahead and create simple registration and login forms. Create an index.html and add these forms to the body:
```
<div id="error"></div>
<form id="login" onsubmit="event.preventDefault(); login()">
    <input id="login-email" name="email" type="email" placeholder="email">
    <input id="login-password" name="password" type="password" placeholder="password">
    <button type="submit">Login</button>
</form>
<form id="register" onsubmit="event.preventDefault(); register()">
    <input id="register-email" name="email" type="email" placeholder="email">
    <input id="register-password" name="password" type="password" placeholder="password">
    <button type="submit">Register</button>
</form>
<button id="logout" onclick="logout()">Logout</button>
```
This will create a login and register forms, as well as a place to output any errors that we see.

Let's also add the script to login and register. Create an auth.js file and add these functions to it:
```
login = function() {
    document.getElementById("error").innerText = "";
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    // TODO: login with this email and password
};
register = function() {
    document.getElementById("error").innerText = "";
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    // TODO: register with this email and password
};
logout = function() {
    // TODO: logout the current user
};
```

This should give us a basic form that calls the login and register function when they are submitted!
You can checkout `Part1-1` now.

Run http-server(or any other static file server) in this directory to launch your application.

### [Part1-2] Adding Firebase

Now let's add the firebase library. We can use the js library straight from the cdn:
`<script src="https://www.gstatic.com/firebasejs/4.1.3/firebase.js"></script>`

Next we need to initialize firebase. Add the following script right after the library:
```
<script>
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };
  firebase.initializeApp(config);
</script>
```
You can get your application keys from the firebase console. Read more here: https://firebase.google.com/docs/web/setup

We're ready to get going! You can checkout `Part1-2` now. If you checkout this branch, make sure to create a local secrets file with the firebase keys in it.

### [Part1-3] Adding Firebase Auth

We are going to use a simple email and password authentication: https://firebase.google.com/docs/auth/web/password-auth

First enable email and password as a sign in method through the firebase console. You can do this under Auth > Sign in method tab.

**Let's add registration!**

In our register() function, add the following lines:
```
firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("error").innerText = error.message;
    }
);
```
That's it! We've added registration to our application. If firebase throws an error this gets logged to the error div.

**Let's add login!**

In our login() function, add the following lines:
```
firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("error").innerText = error.message;
    }
);
```
Looks very much like the register method, and it's pretty simple to add login to your app!

You can verify that you were able to log in by running this in the console: `firebase.auth().currentUser`

**Let's add logout!**

In our logout() function, add the following line:
```
firebase.auth().signOut();
```
This will sign the current user out of the application.

**Listening to auth changes**

You can listen to when the user state changed and hide and show the login/logout forms accordingly:
```
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
```
This will hide toggle the login button vs the auth dialog when the user is logged in.
You can checkout `Part1-3`.

We have successfully added authenticaiton and login to our application. 
Feel free to add styles as like, or checkout `Part1`.

## [Part2] Adding Data

So far we have a login/registration form so that players can login if they want their musical boxes to be saved.
If we create a new user, however, they initially start out with no boxes.

### [Part2-1] Add Musical Box button

Let's create a method so that a player can add boxes once they are logged in.

Go ahead and add an `Add Musical Box` button in your html.
```
<button onclick="addBox()">Add Musical Box</button>
```

And add an `addBox` function to a new database.js script (make sure to include this in your html)
```
var getNewBox = function() {
    return {
      name: "My Musical Box",
      data: new Array(2).fill(new Array(4).fill(false)),
    }
  }

addBox = function() {
    var box = getNewBox();
    // TODO: Add a new box 
}
```
So far we are just creating a function that gets called whenever the addBox button is clicked.
Next we will hook it up to add to our database. Checkout `Part2-1` now.

### [Part2-2] Add Box to DB
Now that we have everything that we need to add the box to the db, it's only a few lines to get it there!
Add this in your `addBox` function:
```
var uid = firebase.auth().currentUser.uid;
var database = firebase.database();
box.id = database.ref('players/' + uid).push(box).key;    
```
Great! All this is doing is that for the current player's uid, it is creating a new entry in their list of boxes in the db with the given information.
This returns an id which we have saved to our box.
Checkout `Part2-2` now.

**Check it out in firebase!**

If you open up your firebase project now, you'll see that everytime a new box is added, there's a new entry in the db realtime! Woo!
We have successfully added a box to our database for the given user's id! 
Checkout `Part2`

## [Part3] Updating data 
Whenever the player updates the musical box, we want to send that information to the database.

### [Part3-1] Setting up a basic form
We are not going to worry about any UI for the purpose of this tutorial. Let's just create an input field with data that we can manipulate!

Go ahead and add this to your index.html:
```
<textarea id="box" onchange="updateBox()"></textarea>
```

Let's also populate this input field when we add a new box. Add this to your addBox function
```
document.getElementById("box").innerText = JSON.stringify(box);
```

Lastly, create an updateBox function in database.js:
```
updateBox = function() {
    var newBox = JSON.parse(document.getElementById("box").value)
    // TODO: Update db
}
```
Great, we're all ready to add the database call! You can checkout `Part3-1`

### [Part3-2] Updating the database
Let's go ahead and modify the the data now. Add this to your updateBox function:
```
var box = JSON.parse(document.getElementById("box").value);
var uid = firebase.auth().currentUser.uid;
var database = firebase.database();
database.ref("players/" + uid + "/" + box.id).set(box);
```
Here we are calling the update function for the current player's uid, for the id of the box. 
By using the box id that we stored earlier, we can just update the one box we care about.
Checkout `Part3-2`

**Check it out in firebase!**

If you open up your firebase window side by side, you will see that everytime you update the UI, the firebase data also updates.
That's pretty awesome!
Checkout `Part3`

## [Part4] Data retrieval
So far we have been adding data to firebase, now let's add a list of all the user's musical boxes to the UI.

### [Part4-1] Reading from the database
First let's just output a list of all the musical boxes that the current user has. 
Add this to your index.html:
```
<button onclick="getMyBoxes()">Get My Music Boxes</button>
<p>My Music boxes</p>
<ul id="myMusicBoxes"></ul>
```
Add this to your database.js script:
```
getMyBoxes = function() {
    var uid = firebase.auth().currentUser.uid;
    var database = firebase.database();
    database.ref("players/" + uid).on("value", function(snapshot){
        var boxes = Object.values(snapshot.val());
        document.getElementById("myMusicBoxes").innerHTML = '';
        boxes.forEach(function(box){
            document.getElementById("myMusicBoxes").innerHTML += '<li>' + box.name + '</li>'
        })
    })
}
```
Everytime you add a new box, or make any updates, firebase will fire this event letting you know that the list of games has updated.
Checkout `Part4-1`

### [Part4-2] More Reading from the database
We can do this for all of the other musical boxes also that other people created:
```
<button onclick="getPublicBoxes()">Get Public Music Boxes</button>
<p>Public Music boxes</p>
<ul id="publicMusicBoxes"></ul>
```
```
getPublicBoxes = function() {
    var database = firebase.database();
    database.ref("players/").on("value", function(snapshot){
        var players = Object.values(snapshot.val());

        var boxes = [];
        players.forEach(function(player){
            boxes.concat(Object.values(player))
        })

        document.getElementById("publicMusicBoxes").innerHTML = '';
        boxes.forEach(function(box){
            document.getElementById("publicMusicBoxes").innerHTML += '<li>' + box.name + '</li>'
        })
    })
}
```
Here we are getting all of the musical boxes for all users and parsing through it to list out all of the names of the ones that are public.


## [Part5] Data security
Last but not least, let's talk about security.

Right now, anyone can really access all of the boxes, and have both read and write access to all of our data.
However, what we really want to do is update our database rules so that it is not possible for anyone to access data that is not theirs.

In order to do this, we have to modify the rules through the firebase console.

Currently, our rules look something like:
```
"players": {
      ".read": true,
      ".write": true
    }
  }
```
This allows everyone to both read and write to our db

Let's restrict this:
```
"players": {
    ".read": "true",
    "$uid": {
        ".write": "auth.uid === $uid"
    }
}
```

This restricts anyone that is not authenticated with the uid from writing to the table