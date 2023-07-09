const Argument = require("./Argument");

class BooleanArgument extends Argument
{
    getTypeName()
    {
        return "value";
    }
}
module.exports = BooleanArgument;