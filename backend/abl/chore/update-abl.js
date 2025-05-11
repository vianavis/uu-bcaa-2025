const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const addFormats = require("ajv-formats")
const { idSchema, updateChoreSchema } = require("../../schemas/chore-schemas");

async function UpdateAbl(choreId, body, res) {
    const ajv = new Ajv();
    addFormats(ajv);
    const validId = ajv.validate(idSchema, choreId);
    const validBody = ajv.validate(updateChoreSchema, body);

    if (!validId || !validBody) {
        return res.status(400).json({error: ajv.errors});
    }

    const { data, status, error } = await dao.updateChore(choreId, body);

    if (data && status === "OK") {
        res.status(201).json(data);
    } else {
        if (status === "ERROR-EMPTY") {
            res.status(404).json({error});
        }

        if (status === "ERROR-INVALID-ROOM_ID" || status === "ERROR-MISSING-DAYS_OF_WEEK") {
            res.status(400).json({error});
        }

        if (error) {
            res.status(500).json({error});
        }
    }
}

module.exports = UpdateAbl;