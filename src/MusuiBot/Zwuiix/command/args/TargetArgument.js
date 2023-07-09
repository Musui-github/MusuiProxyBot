const Argument = require("./Argument");

class TargetArgument extends Argument
{
    getTypeName()
    {
        return "target";
    }
}
module.exports = TargetArgument;