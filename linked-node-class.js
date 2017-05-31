/**
 * @class Node
 * @constructor
 */
function LinkedNodeClass(inPrev, inVal, inNext) {

    /**
     * Pointer to the node that comes before this node in the data structure. 
     * Will be NULL if this is the first node.
     * @property _prevNode
     * @type Object
     * @private
     */
    this._prevNode = inPrev;

    /**
     * The value contained within this node.
     * @property _nodeVal
     * @type Object
     * @private
     */
    this._nodeVal = inVal;

    /**
     * Pointer to the node that comes after this node in the data structure. 
     * Will be NULL if this is the last node.
     * @property _nextNode
     * @type Object
     * @private
     */
    this._nextNode = inNext;
}

LinkedNodeClass.prototype = {

    //restore constructor
    constructor: LinkedNodeClass,

    /**
     * Returns the value stored within this node.
     * @return {T}
     * @method getValue
     */
    getValue: function() {
        return this._nodeVal;
    },

    /**
     * Returns the next node.
     * @return {LinkedNode}
     * @method getNext
     */
    getNext: function() {
        return this._nextNode;
    },

    /**
     * Returns the previous node.
     * @return {LinkedNode}
     * @method getPrev
     */
    getPrev: function() {
        return this._prevNode;
    },

    /**
     * Sets the object's next node to NULL.
     * @return {void}
     * @method setNextPointerToNull
     */
    setNextPointerToNull: function() {
        this._nextNode = null;
    },

    /**
     * Sets the object's previous node to NULL.
     * @return {void}
     * @method setPreviousPointerToNull
     */
    setPreviousPointerToNull: function() {
        this._prevNode = null;
    },

    /**
     * Sets the object's previous and next node so that they point to this node appropriately.
     * @return {void}
     * @method setBeforeAndAfterPointers
     */
    setBeforeAndAfterPointers: function() {
        if (this._prevNode != null) {
            this._prevNode._nextNode = this;
        }

        if (this._nextNode != null) {
            this._nextNode._prevNode = this;
        }
    }
}