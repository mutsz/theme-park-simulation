function getUniform(min, max) {
	  // var uniRand;
  	// uniRand = Math.random() % ((max + 1) - min) + min;
  	// return (parseInt(uniRand));
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function getNormal(mean, stdDev) {
	  var NUM_UNIFORM = 12;
  	var MAX = 1000;
   	var ORIGINAL_MEAN = NUM_UNIFORM * 0.5;
  	var sum, i, standardNormal, newNormal, uni;
  	sum = 0;
  	for (i = 0; i < NUM_UNIFORM; i++) {
  		uni = Math.floor(Math.random() * (MAX + 1));
    	sum += uni;
  	}
  	sum = sum / MAX;
  	standardNormal = sum - ORIGINAL_MEAN;
  	newNormal = mean + stdDev * standardNormal;
  	if (newNormal < 0) {
  		newNormal *= -1;
  	}
  	return (parseInt(newNormal));
}