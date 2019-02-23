var assert = require('assert');
const {MessageBus} = require("./messageBus")
describe('Message Bus', function () {
    it("send really simple message", function () {

        // create message buses
        const bus1 = new MessageBus();
        const bus2 = new MessageBus();

        // connect message buses
        bus1.otherMessageBus = bus2;
        bus2.otherMessageBus = bus1;

        let calledPrintPenguinName = false;

        // set up subscription
        bus2.subscriber = {
            printPenguinName: function() {
                console.log("printPenguinName()");
                calledPrintPenguinName = true;
            }
        };

        // // create a message to send from bus1 to bus2
        // const printPenguinNameMessage = {
        //     type: "function",
        //     name: "printPenguinName",
        //     args: [
        //         // {
        //         //   type: "function",
        //         //   name: "f@12345"
        //         // }
        //     ]
        // };

        // now bus2 receives a message.
        // bus2.onMessage(printPenguinNameMessage);
        bus1.publisher.printPenguinName();

        assert(calledPrintPenguinName);
    });

    it("call function with callback", function() {
        // create message buses
        const bus1 = new MessageBus();
        const bus2 = new MessageBus();

        // connect message buses
        bus1.otherMessageBus = bus2;
        bus2.otherMessageBus = bus1;

        // set up subscription
        bus2.subscriber = {
            getPenguinName: function(callback) {
                console.log("getPenguinName()");
                callback("Phil");
            }
        };

        // create a message to send from bus1 to bus2
        const getPenguinNameMessage = {
            type: "function",
            name: "getPenguinName",
            args: [
                {
                    type: "function",
                    name: "f@12345"
                }
            ]
        };

        let nameReturned = null;

        // send a message with a callback
        // bus2.onMessage(getPenguinNameMessage)
        bus1.publisher.getPenguinName(name => {
            nameReturned = name;
        });

        assert.equal(nameReturned, "Phil");
    })
});