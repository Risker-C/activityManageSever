module.exports = function( object, array=[]){
  var newObject = {}
  // console.log("array",array)
  if(array.length == 0){
    array = Object.keys(object)
  }
  array.forEach((item,index) => {
    switch (item) {
      case 'publishActivity':
        newObject['publishNum'] = object[item] ? object[item].length : 0
        break;
      case 'attendActivity':
        newObject['attendNum'] = object[item] ? object[item].length : 0
        break;
      default:
        newObject[item] = object[item]?object[item]:''
        break;
    }
  });
  return newObject
}
