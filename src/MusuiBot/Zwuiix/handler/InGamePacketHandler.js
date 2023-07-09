const {Vector3, fromObject} = require("../utils/math/Vector3");
const PlayerEntity = require("../entity/PlayerEntity");
const Vector2 = require("../utils/math/Vector2");
class InGamePacketHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
        client.getNetworkSession().getClient().on("serverbound", (packet) => {
            switch (packet.name) {
                case "command_request":
                    let command = packet.params.command;
                    let split = command.split(/ +/g);
                    let cmdName = `${split.shift()}`.toLowerCase().replace("/", "");
                    if(client.getCommandHandler().existCommand(cmdName)) {
                        let cmd = client.getCommandHandler().getCommandByName(cmdName);
                        cmd.onPreRun(client, split);

                        packet.params.command = "";
                    }
                    break;
            }
        });
        client.getNetworkSession().getClient().on("clientbound", (packet) => {
            switch (packet.name) {
                case "add_player":
                    client.getWorld().getPlayersEntities().set(packet.params.runtime_id, new PlayerEntity(
                        packet.params.username,
                        packet.params.uuid,
                        packet.params.runtime_id,
                        fromObject(packet.params.position),
                        new Vector2(packet.params.yaw, packet.params.pitch),
                        packet.params.device_id,
                        packet.params.device_os,
                        ));
                    client.getWorld().getEntityRotations().set(packet.params.runtime_id, new Vector2(packet.params.yaw, packet.params.pitch));
                    client.setCurrentTarget(packet.params.runtime_id);
                    break;
                case "remove_entity":
                    let entityId = packet.params.entity_id_self;
                    if (client.getWorld().getPlayersEntities().has(entityId)) client.getWorld().getPlayersEntities().delete(entityId);
                    if(client.getWorld().getEntityRotations().has(entityId)) client.getWorld().getEntityRotations().delete(entityId);
                    if(client.getCurrentTarget() == entityId) client.setCurrentTarget(-1);
                    if(client.getWorld().getPlayersEntities().has(entityId)) client.getWorld().getPlayersEntities().delete(entityId);
                    break;
                case "available_commands":
                    let commands = client.getCommandHandler().getAll();
                    packet.params.values_len += commands.size;

                    commands.forEach((command) => {
                        packet.params.enum_values.push(`${command.getName()}`);
                        packet.params.command_data.push({
                            name: `${command.getName()}`,
                            description: `${command.getDescription()}`,
                            flags: 0,
                            permission_level: 0,
                            alias: -1,
                            overloads: command.getOverload(),
                        });
                    });
                    break;
            }
        });
    }
}
module.exports = InGamePacketHandler;