function RideClass() {
	// constant parameters
	this.attractionName = ATTRACTION_NAME;
	// var seatsAvail = SEATS_AVAIL;
	this.timeList = [];

	// keep tracking some values while running the sim
	this.currentObj = {
		currentTime: 0,
		currentRiderId: 1,
		currentCarId: 1,
		currentSeatsAvail: SEATS_AVAIL,
		// leftSeats
		currentSeatsLeft: SEATS_AVAIL
	};

	this.SFPSpecificItems = {
		currentNum: 0,
		maxWaitTime: 0,
		sumNum: 0,
		sumWaitTime: 0,
		maxNum: 0,
		// haveMinArvTimePerCar: false,
		// minArvTimePerCar: 0
	};

	this.FPSpecificItems = {
		currentNum: 0,
		maxWaitTime: 0,
		sumNum: 0,
		sumWaitTime: 0,
		maxNum: 0,
		// haveMinArvTimePerCar: false,
		// minArvTimePerCar: 0
	};

	this.STDSpecificItems = {
		currentNum: 0,
		maxWaitTime: 0,
		sumNum: 0,
		sumWaitTime: 0,
		maxNum: 0,
		// haveMinArvTimePerCar: false,
		// minArvTimePerCar: 0
	};

	// determine if the park is closed
	this.isClosing = false;

	this.numBadCar = 0;

	this.eventList = new SortedListClass();
	this.queueSFP = new FIFOQueueClass();
	this.queueFP = new FIFOQueueClass();
	this.queueSTD = new FIFOQueueClass();
}

RideClass.prototype = {

	constructor: RiderClass,

	_printCurrentTime: function() {
		console.log("Time: " + this.currentObj.currentTime);
	},

	_printCurrentNum: function(SFPCurrentNum, FPCurrentNum, STDCurrentNum) {
		console.log("Current Waiting Number: ");
		console.log("	" + SFP + ": " + SFPCurrentNum);
		console.log("	" + FP + ": " + FPCurrentNum);
		console.log("	" + STD + ": " + STDCurrentNum);
	},

	_enqueueRider: function(inQueue, specificItems, queueType) {
		var newRider = new RiderClass();
		newRider.setRiderId(this.currentObj.currentRiderId);
		newRider.setRiderArvTime(this.currentObj.currentTime);

		inQueue.enqueue(newRider);
		specificItems.currentNum++;
		specificItems.sumNum++;

		console.log("Customer " + this.currentObj.currentRiderId + " arrives and goes to line " + queueType);
	},

	_checkMaxNum: function(specificItems) {
		if (specificItems.currentNum > specificItems.maxNum) {
			specificItems.maxNum = specificItems.currentNum;
		}
	},

	_dequeueRider: function(loopNum, inQueue, outRider, queueType, specificItems, carEventSpecificItems, riders) {
		for (var i = 0; i < loopNum; i++) {
			var outRider = inQueue.dequeue();
			if (outRider) {
				riders.push({queue: queueType, id: outRider.getRiderId()});
				console.log("Customer " + outRider.getRiderId() + " of " + queueType + " line");
				this.currentObj.currentSeatsAvail--;
				specificItems.currentNum--;
				if (!carEventSpecificItems.haveMinArvTimePerCar) {
					carEventSpecificItems.minArvTimePerCar = outRider.getRiderArvTime();
					carEventSpecificItems.haveMinArvTimePerCar = true;
				}
				specificItems.sumWaitTime += (this.currentObj.currentTime - outRider.getRiderArvTime());
			} else {
				break;
			}
		}
		this.currentObj.currentSeatsLeft = this.currentObj.currentSeatsAvail;
	},

	_checkMaxWaitTime: function(specificItems, carEventSpecificItems) {
		if (carEventSpecificItems.haveMinArvTimePerCar && (this.currentObj.currentTime - carEventSpecificItems.minArvTimePerCar) > specificItems.maxWaitTime) {
			specificItems.maxWaitTime = this.currentObj.currentTime - carEventSpecificItems.minArvTimePerCar;
		}
	},

	_finalizeMaxWaitTime: function(maxWaitTime, sumNum) {
		if (maxWaitTime == 0 && sumNum != 0) {
			return this.currentObj.currentTime;
		} else {
			return maxWaitTime;
		}
	}, 

	_finalizeAvgWaitTime: function(sumWaitTime, sumNum) {
		if (sumNum != 0) {
			return sumWaitTime / sumNum;
		} else {
			return 0;
		}
	},

	_printStats: function(sumNum, statsVar) {
		if (sumNum != 0) {
			console.log(statsVar);
		} else {
			console.log("No customers at all");
		}
	},

	_processRiderEvent: function(inParameters) {
		this._printCurrentTime();

		// assign the customer to one of the lines
		var randPriorityNum = getUniform(RIDER_UNI_MIN, RIDER_UNI_MAX);
		console.log(randPriorityNum, inParameters.getPctOfSFP(), randPriorityNum <= inParameters.getPctOfSFP());
		// console.log(inParameters.getPctOfSFP());
		if (randPriorityNum <= inParameters.getPctOfSFP()) {
			this._enqueueRider(this.queueSFP, this.SFPSpecificItems, SFP);
			this.timeList.push({time: this.currentObj.currentTime * 1000, type: "RIDER", rider: {queue: SFP, id: this.currentObj.currentRiderId}});
		} else if (randPriorityNum > inParameters.getPctOfSFP() && randPriorityNum <= (inParameters.getPctOfSFP() + inParameters.getPctOfFP())) {
			this._enqueueRider(this.queueFP, this.FPSpecificItems, FP);
			this.timeList.push({time: this.currentObj.currentTime * 1000, type: "RIDER", rider: {queue: FP, id: this.currentObj.currentRiderId}});
		} else {
			this._enqueueRider(this.queueSTD, this.STDSpecificItems, STD);
			this.timeList.push({time: this.currentObj.currentTime * 1000, type: "RIDER", rider: {queue: STD, id: this.currentObj.currentRiderId}});
		}

		// print out each priority lines' number of people waiting
		this._printCurrentNum(this.SFPSpecificItems.currentNum, this.FPSpecificItems.currentNum, this.STDSpecificItems.currentNum); 

		// update the maximum number of people (for each line)
		this._checkMaxNum(this.SFPSpecificItems);
		this._checkMaxNum(this.FPSpecificItems);
		this._checkMaxNum(this.STDSpecificItems);

		// done with this rider event
		this.currentObj.currentRiderId++;

		// add a new rider event
		var newEvent = new EventClass();
		newEvent.setEventType("rider");
		newEvent.setEventTime(getNormal(inParameters.getRiderArvMean(), inParameters.getRiderArvStddev()) + this.currentObj.currentTime);
  		
  		if (newEvent.getEventTime() <= inParameters.getClosingTime()) {
  			this.eventList.insertValue(newEvent);
  			console.log("Set new rider event (customer " + this.currentObj.currentRiderId + ") at time " + newEvent.getEventTime());
  		} else {
  			this.isClosing = true;
  			console.log("Next event will be " + newEvent.getEventTime() + "; therefore, won't acceptthat customer and stop accepting any new customer");
  		}
  	},

  	_processCarEvent: function(inParameters) {
  		this._printCurrentTime();

  		// set some variables needed for every car event
  		var outRider = new RiderClass();
  		var SFPCarEventSpecificItems = {
  			haveMinArvTimePerCar: false,
  			minArvTimePerCar: 0
  		};
  		var FPCarEventSpecificItems = {
  			haveMinArvTimePerCar: false,
  			minArvTimePerCar: 0
  		};
  		var STDCarEventSpecificItems = {
  			haveMinArvTimePerCar: false,
  			minArvTimePerCar: 0
  		};

  		console.log("Car" + this.currentObj.currentCarId + " leaves with the following customers:");

		var riders = [];
  		// dequeue customers one by one
  		this._dequeueRider(inParameters.getIdealNumSFP(), this.queueSFP, outRider, SFP, this.SFPSpecificItems, SFPCarEventSpecificItems, riders);
  		this._dequeueRider(inParameters.getIdealNumFP(), this.queueFP, outRider, FP, this.FPSpecificItems, FPCarEventSpecificItems, riders);
  		this._dequeueRider(inParameters.getIdealNumSTD(), this.queueSTD, outRider, STD, this.STDSpecificItems, STDCarEventSpecificItems, riders);

  		this._dequeueRider(this.currentObj.currentSeatsLeft, this.queueSFP, outRider, SFP, this.SFPSpecificItems, SFPCarEventSpecificItems, riders);
  		this._dequeueRider(this.currentObj.currentSeatsLeft, this.queueFP, outRider, FP, this.FPSpecificItems, FPCarEventSpecificItems, riders);
  		this._dequeueRider(this.currentObj.currentSeatsLeft, this.queueSTD, outRider, STD, this.STDSpecificItems, STDCarEventSpecificItems, riders);
  		
  		this.timeList.push({time: this.currentObj.currentTime * 1000, type: "CAR", car: {id: this.currentObj.currentCarId, emptySeats: this.currentObj.currentSeatsAvail}, riders: riders});
  		if (this.currentObj.currentSeatsAvail > 0) {
  			console.log("Car leaves without filled");
  			this.currentObj.currentSeatsAvail = 0;
  			this.numBadCar++;
  		}

  		// print out each priority lines' num of people waiting
  		this._printCurrentNum(this.SFPSpecificItems.currentNum, this.FPSpecificItems.currentNum, this.STDSpecificItems.currentNum); 

  		// update the maximum wait time (for each line)
  		this._checkMaxWaitTime(this.SFPSpecificItems, SFPCarEventSpecificItems);
  		this._checkMaxWaitTime(this.FPSpecificItems, FPCarEventSpecificItems);
  		this._checkMaxWaitTime(this.STDSpecificItems, STDCarEventSpecificItems);

  		// done with this car event
  		this.currentObj.currentCarId++;
  		this.currentObj.currentSeatsAvail = SEATS_AVAIL;

  		// add a new car event
  		if (this.isClosing && (this.SFPSpecificItems.currentNum == 0 && this.FPSpecificItems.currentNum == 0 && this.STDSpecificItems.currentNum == 0)) {
  			console.log("Don't need car any more");
  			console.log("Some Statistics:");

  			console.log("Maximum " + SFP + "customer wait time: ");
  			this._printStats(this.SFPSpecificItems.sumNum, this._finalizeMaxWaitTime(this.SFPSpecificItems.maxWaitTime, this.SFPSpecificItems.sumNum));
  			console.log("Maximum " + FP + "customer wait time: ");
  			this._printStats(this.FPSpecificItems.sumNum, this._finalizeMaxWaitTime(this.FPSpecificItems.maxWaitTime, this.FPSpecificItems.sumNum));
  			console.log("Maximum " + STD + "customer wait time: ");
			this._printStats(this.STDSpecificItems.sumNum, this._finalizeMaxWaitTime(this.STDSpecificItems.maxWaitTime, this.STDSpecificItems.sumNum));

			console.log("Length of the Longest " + SFP + " Line: ");
			this._printStats(this.SFPSpecificItems.sumNum, this.SFPSpecificItems.maxNum);
			console.log("Length of the Longest " + FP + " Line: ");
			this._printStats(this.FPSpecificItems.sumNum, this.FPSpecificItems.maxNum);
			console.log("Length of the Longest " + STD + " Line: ");
			this._printStats(this.STDSpecificItems.sumNum, this.STDSpecificItems.maxNum);

			console.log("Average " + SFP + " customer wait time: ");
			this._printStats(this.SFPSpecificItems.sumNum, this._finalizeAvgWaitTime(this.SFPSpecificItems.sumWaitTime, this.SFPSpecificItems.sumNum));
			console.log("Average " + FP + " customer wait time: ");
			this._printStats(this.FPSpecificItems.sumNum, this._finalizeAvgWaitTime(this.FPSpecificItems.sumWaitTime, this.FPSpecificItems.sumNum));
			console.log("Average " + STD + " customer wait time: ");
			this._printStats(this.STDSpecificItems.sumNum, this._finalizeAvgWaitTime(this.STDSpecificItems.sumWaitTime, this.STDSpecificItems.sumNum));

			console.log("Number of Cars Leaving Without Filled: " + this.numBadCar);
  		} else {
  			var newEvent = new EventClass();
  			newEvent.setEventType("car");
  			newEvent.setEventTime(getUniform(inParameters.getCarArvMin(), inParameters.getCarArvMax()) + this.currentObj.currentTime);
  			this.eventList.insertValue(newEvent);
  			console.log("Set new car event (car " + this.currentObj.currentCarId + ") at time " + newEvent.getEventTime());
  		}
  	},

  	run: function(inParameters) {
  		// initialize first rider event
  		var newRiderEvent = new EventClass();
  		newRiderEvent.setEventType("rider");
  		newRiderEvent.setEventTime(getNormal(inParameters.getRiderArvMean(), inParameters.getRiderArvStddev()) + this.currentObj.currentTime);
  		this.eventList.insertValue(newRiderEvent);
  		console.log("First rider event time: " + newRiderEvent.getEventTime());

  		// initialize first car event
  		var newCarEvent = new EventClass();
  		newCarEvent.setEventType("car");
  		newCarEvent.setEventTime(getUniform(inParameters.getCarArvMin(), inParameters.getCarArvMax()) + this.currentObj.currentTime);
  		this.eventList.insertValue(newCarEvent);
  		console.log("First car event time: " + newCarEvent.getEventTime());

  		while (this.eventList.getNumElems() != 0) {
  			var currentEvent = new EventClass();
  			currentEvent = this.eventList.removeFront();
  			if (currentEvent) {
  				this.currentObj.currentTime = currentEvent.getEventTime();
	  			if (currentEvent.getEventType() == "rider") {
	  				this._processRiderEvent(inParameters);
	  			} else {
	  				this._processCarEvent(inParameters);
	  			}
  			}
  		}
  	},

  	getTimeList: function() {
  		return this.timeList;
  	}
}
