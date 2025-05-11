const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const addFormats = require("ajv-formats")
const { createChoreSchema } = require("../../schemas/chore-schemas");

async function CreateAbl(body, res) {
    const ajv = new Ajv();
    addFormats(ajv);
    const valid = ajv.validate(createChoreSchema, body);

    if (!valid) {
        return res.status(400).json({error: ajv.errors});
    }

    if (body.repeatType === "weekly") {
        if (!body.daysOfWeek || body.daysOfWeek.length === 0) {
            return res.status(400).json({error: "Missing days of week for weekly repeat type."});
        }
    }

    const chore = {
        name: body.name,
        description: body.description ? body.description : "",
        roomId: body.roomId,
        startDate: body.startDate ? body.startDate : new Date().toISOString().slice(0, 10),
        repeatType: body.repeatType,
        daysOfWeek: body.repeatType === "weekly" ? body.daysOfWeek : null,
        timeOfDay: body.timeOfDay,
        dateCompleted: null,
        createdAt: new Date().toISOString()
    }

    const { data, status, error } = await dao.createChore(chore);

    if (status === "ERROR-INVALID-ROOM_ID") {
        res.status(400).json({error});
    }

    if (!data || status === "ERROR") {
        res.status(500).json({ error: "Internal server error: " + error });
    }

    res.json(data);
}

module.exports = CreateAbl;