"use strict";

const idSchema = {
    "type": "string",
};

const getRoomSchema = idSchema;

const createRoomSchema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
    },
    "required": ["name"]
};

const deleteRoomSchema = idSchema;

const updateRoomSchema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
    },
    "required": []
};

module.exports = {
    idSchema,
    getRoomSchema,
    createRoomSchema,
    deleteRoomSchema,
    updateRoomSchema
};