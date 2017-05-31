function SimulationParametersClass(inClosingTime,
			                       inRiderArvMean,
			                       inRiderArvStddev,
			                       inCarArvMin,
			                       inCanArvMax,
			                       inPctOfSFP,
			                       inPctOfFP,
			                       inIdealNumSFP,
			                       inIdealNumFP) {
	this._closingTime = inClosingTime;
    this._riderArvMean = inRiderArvMean;
    this._riderArvStddev = inRiderArvStddev;
    this._carArvMin = inCarArvMin;
    this._carArvMax = inCanArvMax;
    this._pctOfSFP = inPctOfSFP;
    this._pctOfFP = inPctOfFP;
    this._pctOfSTD = 100 - this._pctOfSFP - this._pctOfFP;
    this._idealNumSFP = inIdealNumSFP;
    this._idealNumFP = inIdealNumFP;
    this._idealNumSTD = SEATS_AVAIL - this._idealNumSFP - this._idealNumFP;
}

SimulationParametersClass.prototype = {

    constructor: SimulationParametersClass,

	getClosingTime: function() {
		return this._closingTime;
	},

    getRiderArvMean: function() {
    	return this._riderArvMean;
    },
    
    getRiderArvStddev: function() {
    	return this._riderArvStddev;
    },

    getCarArvMin: function() {
    	return this._carArvMin;
    },

    getCarArvMax: function() {
    	return this._carArvMax;
    },

    getPctOfSFP: function() {
    	return this._pctOfSFP;
    },

    getPctOfFP: function() {
    	return this._pctOfFP;
    },

    getPctOfSTD: function() {
    	return this._pctOfSTD;
    },

	getIdealNumSFP: function() {
		return this._idealNumSFP;
	},

    getIdealNumFP: function() {
    	return this._idealNumFP;
    },

    getIdealNumSTD: function() {
        return this._idealNumSTD;
    }
}