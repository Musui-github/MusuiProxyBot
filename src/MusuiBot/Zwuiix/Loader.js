const Config = require('./utils/Config');
const Path = require("path");
const Client = require("./Client");
const { Relay } = require('bedrock-protocol');
const NetworkSession = require("./network/NetworkSession");
const bedrock = require('bedrock-protocol');
const musui = new Config(Path.join(process.cwd() + "/musui.json"));
if(musui.config === {}) {
    musui.setAll({
        username: "Unknown",
        host: "Unknown",
        port: 19132,
        connectTimeout: 1500
    });
    musui.save();
}

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
            throw new Error("There was an error sending the connectTimeout.");
        }
        if(!config instanceof Config) {
            throw new Error("There was an error loading the config.");
        }

        this.config = config;

        const relay = new Relay({
            host: '0.0.0.0',
            port: 19132,
            offline: true,
            destination: {
                host: host,
                port: port,
                offline: false
            }
        })
        relay.listen()
        relay.on('connect', player => {
            console.log('New connection', player.connection.address)

            player.on('login', () => {
                console.log("Logged in as " + player.profile.name);
                new Client(new NetworkSession(player), this);
            })
        })
    }

    getConfig()
    {
        return this.config;
    }
}

new Loader(musui.get('username', 'Unknown'), musui.get('host', 'unknown'), musui.get('port', 19132), musui.get('connectTimeout', 1500), musui);