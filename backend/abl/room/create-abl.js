const RoomsDao = require("../../dao/rooms-dao");
let dao = new RoomsDao();

const Ajv = require("ajv").default;
const { createRoomSchema } = require("../../schemas/room-schemas");

async function CreateAbl(body, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(createRoomSchema, body);

    if (!valid) {
        return res.status(400).json({error: ajv.errors});
    }

    const room = {
        name: body.name,
        description: body.description ? body.description : "",
    }

    const { data, status, error } = await dao.createRoom(room);

    if (!data || status === "ERROR") {
        res.status(500).json({ error: "Internal server error: " + error })
    }

    res.json(data);
}

module.exports = CreateAbl; 