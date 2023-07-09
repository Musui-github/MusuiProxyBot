const Argument = require("./Argument");

class IntegerArgument extends Argument
{
    getTypeName()
    {
        return "int";
    }
}
module.exports = IntegerArgument;