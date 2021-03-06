var fs = require('fs');
var path = require('path');
var GPIO_Path = "/sys/class/gpio";

var Gpio = function () {
    
    this.OUTPUT_MODE = "out";
    this.INPUT_MODE = "in";
    var exportedPins = [];
    var gpioPins = {
        '3': 2,
        '5': 3,
        '7': 4,
        '8': 14,
        '10': 15,
        '11': 17,
        '12': 18,
        '13': 27,
        '15': 22,
        '16': 23,
        '18': 24,
        '19': 10,
        '21': 9,
        '22': 25,
        '23': 11,
        '24': 8,
        '26': 7,
        '29': 5,
        '31': 6,
        '32': 12,
        '33': 13,
        '35': 19,
        '36': 16,
        '37': 26,
        '38': 20,
        '40': 21
    };

    /**
     * Setup a pin for use as an input or output
     *
     * @param {number} pinNo Reference to the pin
     * @param {string} direction The pin direction, either 'in' or 'out'
     */
    this.setup = function (pinNo, direction) {
        if (arguments.length == 1) {
            direction = this.OUTPUT_MODE;
        }
        var currentGpioPath = path.join(GPIO_Path, concateString("gpio", gpioPins[pinNo]));
        if (!fs.existsSync(currentGpioPath)) {
            exportPin(gpioPins[pinNo]);
            setDirection(gpioPins[pinNo], direction);
        }
    };

    /**
     * Read a value from a pin
     *
     * @param {number}  pinNo The pin number to read from
     */
    this.read = function (pinNo) {
        var currentGpioPath = path.join(GPIO_Path, concateString("gpio", gpioPins[pinNo].toString()), "value");
        try {
            var pinValue = fs.readFileSync(currentGpioPath).toString();
            return pinValue.trim() === "1";
        } catch (error) {
            throw new Error('Pin ' + pinNo + ' has not been exported for read');
        }
    }

    /**
     * Write a value to a pin
     *
     * @param {number}   pinNo The pin to write to
     * @param {boolean}  value   If true, turns the pin on, else turns off
     */
    this.write = function (pinNo, value) {
        try {
            var currentGpioPath = path.join(GPIO_Path, concateString("gpio", gpioPins[pinNo]), "value");
            var valueToSet = value ? "1" : "0";
            fs.writeFileSync(currentGpioPath, valueToSet);
        } catch (error) {
            throw new Error('Pin ' + pinNo + ' has not been exported for write');
        }

    };

    /**
   * Unexports all the exported pins
   *
   * @param {number}  pinNo The pin number to read from
   */
    this.tearDown = function () {
        for (var i = 0; i < exportedPins.length; i++) {
            unExportPin(exportedPins[i]);
        }
    };

    var exportPin = function (pinNo) {
        var currentGpioPath = path.join(GPIO_Path, "export");
        fs.writeFileSync(currentGpioPath, pinNo);
        exportedPins[pinNo] = true;
    };

    var unExportPin = function (pinNo) {
        var currentGpioPath = path.join(GPIO_Path, "unexport");
        fs.writeFileSync(currentGpioPath, pinNo);
        exportedPins[pinNo] = false;
    };

    var setDirection = function (pinNo, direction) {
        var currentGpioPath = path.join(GPIO_Path, concateString("gpio", pinNo), "direction");
        fs.writeFileSync(currentGpioPath, direction);
    };

    var concateString = function() {
        var path = "";
        for (arg in arguments) {
            path += arguments[arg];
        }
        return path;
    }
};

module.exports = new Gpio;