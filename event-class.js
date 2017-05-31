function EventClass() {

    this._eventType = '';
    this._eventTime = 0;

}

EventClass.prototype = {

    constructor: EventClass,

    getEventType: function() {
    	return this._eventType;
    },

    getEventTime: function() {
    	return this._eventTime;
    },

    setEventType: function(inType) {
    	this._eventType = inType;
    },

    setEventTime: function(inTime) {
    	this._eventTime = inTime;
    },

    gt: function(lhs, rhs) {
    	return lhs.getEventTime() > rhs.getEventTime();
    },

    loet: function(lhs, rhs) {
    	return lhs.getEventTime() <= rhs.getEventTime();
    }
}