export class NetworkSession
{
    bedrockClient;

    constructor(bedrock_client)
    {
        this.bedrockClient = bedrock_client;
    }

    getClient()
    {
        return this.bedrockClient;
    }

    getHost()
    {
        return this.getClient().host;
    }

    getPort()
    {
        return this.getClient().port;
    }

    sendDataPacket(packet)
    {
        this.getClient().queue(packet.getName(), packet.asObject());
    }
}