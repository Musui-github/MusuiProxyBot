const Argument = require("./Argument");

class StringArgument extends Argument
{
    getTypeName()
    {
        return "string";
    }
}
module.exports = StringArgument;