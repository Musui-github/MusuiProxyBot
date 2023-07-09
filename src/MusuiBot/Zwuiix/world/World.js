const minecraft = require('minecraft-data');
const {BlobEntry, BedrockChunk} = require("prismarine-chunk");
const PrismarineChunk = require('prismarine-chunk');
const BedrockRegistry = require("prismarine-registry");
const registry = BedrockRegistry('bedrock_1.19.1');
const ChunkColumn = PrismarineChunk(registry);
class World
{
    chunkData = new Map();
    entityLocations = new Map();
    entityRotations = new Map();
    playersEntities = new Map();

    /**** @param client {Client}*/
    constructor(client)
    {
    }

    getPlayerByName(name)
    {
        this.playersEntities.forEach((entityId, player) => {
            if(player.getName().toLowerCase() === name.toLowerCase())
                return player;
        });

        return null;
    }

    getChunkData()
    {
        return this.chunkData;
    }

    getEntityLocations()
    {
        return this.entityLocations;
    }

    getEntityRotations()
    {
        return this.entityRotations;
    }

    getPlayersEntities()
    {
        return this.playersEntities;
    }

    getChunk(vector)
    {
        let chunkX = vector.getFloorX() >> 4;
        let chunkZ = vector.getFloorZ() >> 4;
        return this.getChunkData().get(`${chunkX}:${chunkZ}`);
    }

    getIdBlockAt(vector)
    {
        let chunk = this.getChunk(vector);

        return chunk?.getBlockStateId(vector);
    }

    async processLevelChunk(client, packet)
    {
        const cc = new ChunkColumn({x: packet.x, z: packet.z});
        await cc.networkDecodeNoCache(packet.payload, packet.sub_chunk_count);

        if (packet.sub_chunk_count < 0) { // 1.18.0+
            // 1.18+ handling, we need to send a SubChunk request
            const maxSubChunkCount = packet.highest_subchunk_count || 5 // field is set if sub_chunk_count=-2 (1.18.10+)

            if (registry.version['>=']('1.18.11')) {
                // We can send the request in one big load!
                const requests = [];
                for (let i = 1; i < Math.min(maxSubChunkCount, 5); i++) requests.push({dx: 0, dz: 0, dy: i})
                client.queue('subchunk_request', {origin: {x: packet.x, z: packet.z, y: 0}, requests, dimension: 0})
            } else if (registry.version['>=']('1.18')) {
                for (let i = 1; i < Math.min(maxSubChunkCount, 5); i++) {
                    client.queue('subchunk_request', {x: packet.x, z: packet.z, y: i, dimension: 0})
                }
            }
        }

        this.getChunkData().set(`${packet.x}:${packet.z}`, cc);
    }
}
module.exports = World;

// TODO : else if (false) {
//             const misses = await cc.networkDecode(packet.blobs.hashes, blobStore, packet.payload)
//             if (!packet.blobs.hashes.length) return // no blobs
//
//             /*client.queue('client_cache_blob_status', {
//                 misses: misses.length,
//                 haves: 0,
//                 have: [],
//                 missing: misses
//             })*/
//
//             if (packet.sub_chunk_count < 0) { // 1.18+
//                 for (const miss of misses) blobStore.addPending(miss, new BlobEntry({
//                     type: BlobType.Biomes,
//                     x: packet.x,
//                     z: packet.z
//                 }))
//             } else { // 1.17-
//                 const lastBlob = packet.blobs.hashes[packet.blobs.hashes.length - 1]
//                 for (const miss of misses) {
//                     blobStore.addPending(miss, new BlobEntry({
//                         type: miss === lastBlob ? BlobType.Biomes : BlobType.ChunkSection,
//                         x: packet.x,
//                         z: packet.z
//                     }))
//                 }
//                 sentMiss = true
//             }
//
//             blobStore.once(misses, async () => {
//                 // The things we were missing have now arrived
//                 const now = await cc.networkDecode(packet.blobs.hashes, blobStore, packet.payload)
//                 fs.writeFileSync(
//                     `fixtures/${version}/level_chunk CacheMissResponse ${packet.x},${packet.z}.json`,
//                     serialize({blobs: Object.fromEntries(packet.blobs.hashes.map(h => [h.toString(), blobStore.get(h).buffer]))})
//                 )
//                 assert.strictEqual(now.length, 0)
//
//                 client.queue('client_cache_blob_status', {
//                     misses: 0,
//                     haves: packet.blobs.hashes.length,
//                     have: packet.blobs.hashes,
//                     missing: []
//                 })
//
//                 gotMiss = true
//             })
//         }