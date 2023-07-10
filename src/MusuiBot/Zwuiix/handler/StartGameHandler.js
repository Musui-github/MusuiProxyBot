const {Vector3} = require("../utils/math/Vector3");

class StartGameHandler
{
    /**** @param client {Client}*/
    constructor(client)
    {
        client.getNetworkSession().getClient().on("clientbound", (packet) => {
            switch (packet.name) {
                case "start_game":
                    let position = packet.params.spawn_position;
                    client.id = packet.params.runtime_entity_id;
                    client.setPosition(new Vector3(position.x, position.y, position.z));
                    break;
            }
        });
    }
}
module.exports = StartGameHandler;