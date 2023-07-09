export class NetworkSession
{
    bedrockClient;

    constructor(bedrock_client)
    {
        this.bedrockClient = bedrock_client;
    }

    /**
     *
     * @returns {bedrock.Client}
     */
    getClient()
    {
        return this.bedrockClient;
    }

    /**
     *
     * @returns {string}
     */
    getHost()
    {
        return this.getClient().host;
    }

    /**
     *
     * @returns {number}
     */
    getPort()
    {
        return this.getClient().port;
    }

    /**
     *
     * @param packet {Packet}
     */
    sendDataPacket(packet)
    {
        this.getClient().queue(packet.getName(), packet.asObject());
    }
}