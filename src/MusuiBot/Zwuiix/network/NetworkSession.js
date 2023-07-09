class NetworkSession
{
    bedrockClient;

    constructor(bedrock_client)
    {
        this.bedrockClient = bedrock_client;
    }

    /**
     * @returns {bedrock.Client}
     */
    getClient()
    {
        return this.bedrockClient;
    }

    getExtraData()
    {
        return this.getClient().userData;
    }

    /**
     * @returns {string}
     */
    getHost()
    {
        return this.getClient().host;
    }

    /**
     * @returns {number}
     */
    getPort()
    {
        return this.getClient().port;
    }

    /**
     * @param packet {Packet}
     */
    sendServerBoundDataPacket(packet)
    {
        this.getClient().upstream.queue(packet.getName(), packet.asObject());
    }

    /**
     * @param packet {Packet}
     */
    sendClientBoundDataPacket(packet)
    {
        this.getClient().queue(packet.getName(), packet.asObject());
    }
}
module.exports = NetworkSession;