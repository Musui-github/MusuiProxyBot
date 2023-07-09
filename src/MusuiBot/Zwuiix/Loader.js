const Config = require('./utils/Config');
const Path = require("path");
const {Client} = require("./Client");
const {NetworkSession} = require("./network/NetworkSession");
const bedrock = require('bedrock-protocol');
const musui = new Config(Path.join(process.execPath + "musui.json"));

new Loader(musui.get('username', 'Unknown'), musui.get('host', 'unknown'), musui.get('port', 19132), musui.get('connectTimeout', 1500), musui);
class Loader
{
    /*** @type {Config} config*/
    config;

    /**
     *
     * @param username {string}
     * @param host {string}
     * @param port {number}
     * @param connectTimeout {number}
     * @param config {Config}
     */
    constructor(username, host, port, connectTimeout, config)
    {
        if(typeof username !== "string") {
            throw new Error("There was an error sending the username..");
        }
        if(typeof host !== "string") {
            throw new Error("There was an error sending the host..");
        }
        if(typeof port !== "number") {
            throw new Error("There was an error sending the port..");
        }
        if(typeof connectTimeout !== "number") {
            throw new Error("There was an error sending the connectTimeout..");
        }
        if(!config instanceof Config) {
            throw new Error("There was an error loading the config.");
        }

        this.config = config;

        let client = bedrock.createClient({
            host: host,
            port: port,
            skipPing: true,
            offline: false,
            username: username,
            connectTimeout: connectTimeout,
        });
        new Client(new NetworkSession(client), this);
    }

    getConfig()
    {
        return this.config;
    }
}