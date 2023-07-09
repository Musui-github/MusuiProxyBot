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

    asObject()
    {
        return this.value;
    }
}