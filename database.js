var getNewBox = function() {
    return {
      name: "My Musical Box",
      data: new Array(2).fill(new Array(4).fill(false)),
    }
  }

addBox = function() {
    var box = getNewBox();
    var uid = firebase.auth().currentUser.uid;
    var database = firebase.database();
    box.id = database.ref('players/' + uid).push(box).key; 

    document.getElementById("box").innerText = JSON.stringify(box);
}

updateBox = function() {
    var newBox = JSON.parse(document.getElementById("box").value)
    var box = JSON.parse(document.getElementById("box").value);
    var uid = firebase.auth().currentUser.uid;
    var database = firebase.database();
    database.ref("players/" + uid + "/" + box.id).set(box);
}

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
