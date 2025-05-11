const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const { deleteChoreSchema } = require("../../schemas/chore-schemas");

async function DeleteAbl(choreId, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(deleteChoreSchema, choreId);

    if (!valid) {
        return res.status(400).json({error: ajv.errors});
    }

    const { status, error } = await dao.deleteChore(choreId);

    if (status === "ERROR-EMPTY") {
        res.status(404).json({ error })
    }

    if (status === "ERROR") {
        res.status(500).json({ error })
    }

    res.status(200).json({ status: "Success" })
}

module.exports = DeleteAbl;