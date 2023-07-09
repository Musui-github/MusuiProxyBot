const Argument = require("./Argument");

class PositionArgument extends Argument
{
    getTypeName()
    {
        return "position";
    }
}
module.exports = PositionArgument;