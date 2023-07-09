const Packet = require('./Packet');
class TextPacket extends Packet
{
    constructor(
        type,
        message,
        source_name,
        xuid,
        platform_chat_id
    ) {
        super("text");
        this.value = {
            type: type,
            needs_translation: false,
            parameters: undefined,
            message: message,
            source_name: source_name,
            xuid: xuid,
            platform_chat_id: platform_chat_id,
        };
    }
}
module.exports = TextPacket;