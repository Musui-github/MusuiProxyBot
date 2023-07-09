const Path = require("path");
class CommandHandler
{
    client;

    commands = new Map();

    constructor(client)
    {
        this.client = client;
    }

    /**
     * @param command {Command}
     */
    register(command)
    {
        if(this.existCommand(command))return false;
        this.commands.set(command.getName(), command);
    }

    unregister(command)
    {
        if(!this.existCommand(command))return false;
        commands.remove(command.getName());
    }

    existCommand(name)
    {
        return this.commands.has(name);
    }

    getAll()
    {
        return this.commands;
    }

    getCommandByName(name)
    {
        return this.commands.get(name);
    }
}
module.exports = CommandHandler;