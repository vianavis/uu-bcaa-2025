const ChoresDao = require("../../dao/chores-dao");
let dao = new ChoresDao();

const Ajv = require("ajv").default;
const { getChoreSchema } = require("../../schemas/chore-schemas");

async function GetAbl(choreId, res) {
    const ajv = new Ajv();
    const valid = ajv.validate(getChoreSchema, choreId);

    if (!valid) {
        return res.status(400).json({error: "Invalid input: " + ajv.errors});
    }

    const chore = await dao.getChore(choreId);

    if (!chore) {
        return res.status(404).json({error: "Chore not found"});
    }

    res.json(chore);
}

module.exports = GetAbl;