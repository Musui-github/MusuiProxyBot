const Command = require("../Command");
const StringArgument = require("../args/StringArgument");

class TargetCommand extends Command
{
    constructor()
    {
        super("target", "Select a player to target");
    }

    prepare()
    {
        this.registerArgument(0, new StringArgument("target", false));
    }

    onRun(player, args)
    {
        if(!args[0])
        {
            player.sendMessage("§cPlease enter a player to target !", false);
            return;
        }

        let targetName = args[0];

        if(targetName.toLowerCase() === "off" || targetName.toLowerCase() === "stop" || targetName.toLowerCase() === "none" || targetName.toLowerCase === "null") {
            player.disableTargeting();
            player.setCurrentTarget(-1);
            player.sendMessage("§6» §fSuccessfully disabled targeting !", false);
            return;
        }

        let target = player.getWorld().getPlayerByName(targetName);

        player.sendMessage(`§6» §fYou are now targeting §e${target.getName()} §f!`, false);
        player.enableTargeting();
        player.setCurrentTarget(target.getRuntimeId());
    }
}
module.exports = TargetCommand