class Command
{
    name;
    description;
    usage;
    aliases = [];

    args = new Map();

    constructor(name, description, usage = `${name} <args>`, aliases = [])
    {
        this.name=name;
        this.description=description;
        this.usage=usage;
        if(aliases !== undefined) this.aliases=aliases;

        this.prepare();
    }

    getName()
    {
        return this.name;
    }

    getDescription()
    {
        return this.description;
    }

    getUsage()
    {
        return this.usage;
    }

    getAliases()
    {
        return this.aliases;
    }

    getArguments()
    {
        return this.args;
    }

    getOverload()
    {
        let overloads = [];
        let defaultOverload = [];

        this.args.forEach((argument) => {
            defaultOverload.push({
                parameter_name: `${argument.getName()}`,
                value_type: `${argument.getTypeName()}`,
                enum_type: "enum",
                optional: true,
                options: {
                    unused: 0,
                    collapse_enum: 0,
                    has_semantic_constraint: 0,
                    as_chained_command: 1,
                    unknown2: 0
                }});

            });

        overloads.push(defaultOverload);
        return overloads;
    }

    registerArgument(number, argument)
    {
        this.args.set(number, argument);
    }

    prepare() {}

    onPreRun(client, args)
    {
        if(this.args.size != args.length) {
            client.sendMessage("§mI'm sorry, you've sent the wrong message.");
            return;
        }

        let newArgs = new Map();
        args.forEach((value, number) => {
            let arg = this.args.get(number);
            switch (arg.getTypeName()) {
                case "int":
                case "integer":
                case "number":
                    newArgs.set(arg.name, parseInt(value));
                    break;
                case "float":
                    newArgs.set(arg.name, parseFloat(value));
                    break;
                case "string":
                    newArgs.set(arg.name, `${value}`);
                    break;
                case "boolean":
                case "bool":
                    newArgs.set(arg.name, `${value}`.toLowerCase() == 'true');
                    break;
            }
        });

        this.onRun(client, newArgs);
    }

    onRun(client, args) {}
}
module.exports = Command;