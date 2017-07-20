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
}