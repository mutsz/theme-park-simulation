/**
 * A linked list implementation in JavaScript.
 * @class DoublyLinkedList
 * @constructor
 */
function SortedListClass() {

    /**
     * Pointer to first item in the list.
     * @property _head
     * @type Object
     * @private
     */
    this._head = null;
    
    /**
     * Pointer to last item in the list.
     * @property _tail
     * @type Object
     * @private
     */    
    this._tail = null;

    /**
     * The number of items in the list.
     * @property _length
     * @type int
     * @private
     */    
    this._length = 0;
}

SortedListClass.prototype = {

    //restore constructor
    constructor: SortedListClass,

    clear: function() {

        while (this._head != null) {
            var temp = this._head;
            this._head = this._head.getNext();
            temp = null;
        }

        this._tail = null;

        this._length = 0;
    },

    /**
     * @param {T} valToInsert The data to add to the list.
     * @return {Void}
     * @method insertValue
     */
    insertValue: function(valToInsert) {
        var gt, let;
        if (typeof(valToInsert) == "object") {
            gt = valToInsert.gt;
            loet = valToInsert.loet;
        } else {
            gt = function(lhs, rhs) {
                return lhs > rhs;
            };
            loet = function(lhs, rhs) {
                return lhs <= rhs;
            };
        }
        var node;
        if (this._length == 0) {
            node = new LinkedNodeClass(this._head, valToInsert, this._tail);
            this._head = node;
            this._tail = node;
        } else if (gt(this._head.getValue(), valToInsert)) {
            node = new LinkedNodeClass(this._head.getPrev(), valToInsert, this._head);
            node.setBeforeAndAfterPointers();
            this._head = node;
        } else if (loet(this._tail.getValue(), valToInsert)) {
            node = new LinkedNodeClass(this._tail, valToInsert, this._tail.getNext());
            node.setBeforeAndAfterPointers();
            this._tail = node;
        } else {
            var temp = this._head;
            while (temp.getNext() != null && loet(temp.getNext().getValue(), valToInsert)) {
                temp = temp.getNext();
            }
            node = new LinkedNodeClass(temp, valToInsert, temp.getNext());
            node.setBeforeAndAfterPointers();
            temp = null;
        }

        this._length++;
    },

    removeFront: function() {
        // theVal may be object(LinkedNode)
        if (this._length > 0) {
            var theVal = this._head.getValue();
            if (this._length == 1) {
                this._head = null;
                this._tail = null;
                // this._length = 0;
            } else {
                this._head = this._head.getNext();
                this._head.setPreviousPointerToNull();
            }
            this._length--;
            // return true;
            return theVal;
        } else {
            // return false;
            console.log(this._length);
            return null;
        }
    },

    removeLast: function() {
        if (this._length > 0) {
            var theVal = this._tail.getValue();
            if (this._length == 1) {
                this._head = null;
                this._tail = null;
                // this._length = 0;
            } else {
                this._tail = this._tail.getPrev();
                this._tail.setNextPointerToNull();
            }
            this._length--;
            // return true;
            return theVal;
        } else {
            // return false;
            return null;
        }
    },

    getNumElems: function() {
        return this._length;
    },

    getElemAtIndex: function(index) {
        var numElems = this._length;
        if (index < 0 || index >= numElems) {
            // return false;
            return null;
        } else {
            var i = 0;
            var temp = this._head;
            while (i < index) {
                temp = temp.getNext();
                i++;
            }
            // maybe just temp
            var theVal = temp.getValue();
            temp = null;
            // return true;
            return theVal;
        }
    }

};