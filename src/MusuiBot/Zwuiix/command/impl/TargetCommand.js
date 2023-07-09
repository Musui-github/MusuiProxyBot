const Command = require("../Command");
const TargetArgument = require("../args/TargetArgument");
const PlayerEntity = require("../../entity/PlayerEntity");

class TargetCommand extends Command
{
    constructor()
    {
        super("target", "Select a player to target");
    }

    prepare()
    {
        this.registerArgument(0, new TargetArgument("target", false));
    }

    onRun(player, args)
    {
        let targetName = args.get("target");

        if(targetName.toLowerCase() === "off" || targetName.toLowerCase() === "stop" || targetName.toLowerCase() === "none" || targetName.toLowerCase === "null") {
            player.setTargeting(false);
            player.setCurrentTarget(-1);
            player.sendMessage("§6» §fSuccessfully disabled targeting !", false);
            return;
        }

        let target = player.getWorld().getPlayerByName(targetName);
        if(!target instanceof PlayerEntity) {
            player.sendMessage(`§6» §cThis player is not connected!`, false);
            return;
        }

        player.sendMessage(`§6» §fYou are now targeting §e${target.getName()} §f!`, false);
        player.setTargeting(true);
        player.setCurrentTarget(target.getRuntimeId());
    }
}
module.exports = TargetCommand