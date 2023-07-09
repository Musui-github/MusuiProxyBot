class Argument
{
    name;
    optional;

    constructor(
        name,
        optional
    ) {
        this.name = name;
        this.optional = optional;
    }

    getName()
    {
        return this.name;
    }

    isOptional()
    {
        return this.optional;
    }

    getTypeName()
    {
        return "raw_text";
    }
}
module.exports = Argument;