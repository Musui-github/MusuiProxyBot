class Packet
{
    name = '';
    value = {};

    constructor(name)
    {
        this.name = name;
    }

    getName()
    {
        return this.name;
    }

    getValue()
    {
        return this.value;
    }

    asObject()
    {
        return this.value;
    }
}
module.exports = Packet;