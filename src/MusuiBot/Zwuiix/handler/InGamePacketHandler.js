const {Vector3, fromObject} = require("../utils/math/Vector3");
const PlayerEntity = require("../entity/PlayerEntity");
const Vector2 = require("../utils/math/Vector2");
class InGamePacketHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
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
                    client.getWorld().getEntityLocations().set(packet.params.runtime_id, fromObject(packet.params.position));
                    client.getWorld().getEntityRotations().set(packet.params.runtime_id, new Vector2(packet.params.yaw, packet.params.pitch));
                    client.setCurrentTarget(packet.params.runtime_id);
                    break;
                case "remove_entity":
                    let entityId = packet.params.entity_id_self;
                    if(client.getWorld().getEntityLocations().has(entityId))
                        client.getWorld().getEntityLocations().remove(entityId);

                    if(client.getWorld().getEntityRotations().has(entityId))
                        client.getWorld().getEntityRotations().remove(entityId);

                    if(client.getCurrentTarget() == entityId)
                        client.setCurrentTarget(-1);

                    if(client.getWorld().getPlayersEntities().has(entityId))
                        client.getHandler().getPlayersEntities().remove(entityId);
                    break;
                case "command_request":
                    let command = packet.params.command;
                    let split = command.split(/ +/g);
                    let cmdName = `${split.shift()}`.toLowerCase();
                    if(client.getCommandHandler().existCommand(cmdName)) {
                        let cmd = client.getCommandHandler().getCommandByName(cmdName);
                        let args = String.join(split, / +/g);
                        cmd.onPreRun(client, args);
                    }
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
    
                    console.log(JSON.stringify(packet.params.command_data));
                    break;
            }
        });
    }
}
module.exports = InGamePacketHandler;