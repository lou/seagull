Quintus.Random = function(Q) {
  Q.random = function(min,max) {
    return Math.ceil(min + Math.random() * (max - min));
  }
};