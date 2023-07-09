const Argument = require("./Argument");

class FloatArgument extends Argument
{
    getTypeName()
    {
        return "float";
    }
}
module.exports = FloatArgument;