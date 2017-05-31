function RiderClass() {
	this._riderId = null;
	this._riderArvTime = null;
}

RiderClass.prototype = {
	constructor: RiderClass,

	getRiderId: function() {
		return this._riderId;
	},

	getRiderArvTime: function() {
		return this._riderArvTime;
	},

	setRiderId: function(inId) {
		this._riderId = inId;
	},

	setRiderArvTime: function(inTime) {
		this._riderArvTime = inTime;
	}
}
