function FIFOQueueClass() {

    this._head = null;
    this._tail = null;

}

FIFOQueueClass.prototype = {

    constructor: FIFOQueueClass,

    enqueue: function(newItem) {
        var newNode;
        if (this._head == null && this._tail == null) {
            newNode = new LinkedNodeClass(this._head, newItem, this._tail);
            this._head = newNode;
            this._tail = newNode;
        } else {
            newNode = new LinkedNodeClass(this._tail, newItem, this._tail.getNext());
            newNode.setBeforeAndAfterPointers();
            this._tail = newNode;
        }
    },

    dequeue: function() {
        if (this._head == null && this._tail == null) {
            // return false;
            return null;
        } else {
            // maybe just this._head;
            var theVal = this._head.getValue();
            if (this._head == this._tail) {
                this._head = null;
                this._tail = null;
            } else {
                this._head = this._head.getNext();
                this._head.setPreviousPointerToNull();
            }
            // return true;
            return theVal;
        }
    },

    print: function() {
        var temp = this._head;
        while (temp != null) {
            console.log(temp.getValue() + " ");
            temp = temp.getNext();
        }
        temp = null;
    }
}