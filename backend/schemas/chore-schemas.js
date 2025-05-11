"use strict";

const idSchema = {
    "type": "string",
};

const getChoreSchema = idSchema;

const createChoreSchema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
        "roomId": idSchema,
        "startDate": {
            "type": "string",
            "format": "date"
        },
        "repeatType": { 
            "type": "string",
            "enum": ["daily", "weekly", "monthly"] 
        },
        "daysOfWeek": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "timeOfDay": {
            "type": "string",
            "enum": ["morning", "afternoon", "evening"]
        },
        "dateCompleted": {
            "type": "string",
            "format": "date-time"
        },
        "createdAt": {
            "type": "string",
            "format": "date-time"
        },
    },
    "required": ["name", "roomId", "repeatType", "timeOfDay"]
};

const deleteChoreSchema = idSchema;

const updateChoreSchema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
        "roomId": idSchema,
        "startDate": {
            "type": "string",
            "format": "date"
        },
        "repeatType": { 
            "type": "string",
            "enum": ["daily", "weekly", "monthly"] 
        },
        "daysOfWeek": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "timeOfDay": {
            "type": "string",
            "enum": ["morning", "afternoon", "evening"]
        },
        "dateCompleted": {
            "type": "string",
            "format": "date-time"
        },
        "createdAt": {
            "type": "string",
            "format": "date-time"
        },
    },
    "required": []
};

const markChoreCompleteSchema = idSchema

const listChoreSchema = {
    "type": "object",
    "properties": {
        "showPending": {"type": "boolean"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "roomId": {
            "type": "array",
            "items": {
              "type": idSchema
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "startDate": {
            "type": "string",
            "format": "date"
        },
        "repeatType": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["daily", "weekly", "monthly"] 
            },
            "uniqueItems": true,
            "minItems": 1,
            "maxItems": 3,
        },
        "daysOfWeek": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            "uniqueItems": true,
            "minItems": 1,
            "maxItems": 7
        },
        "timeOfDay": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["morning", "afternoon", "evening"]
            },
            "uniqueItems": true,
            "minItems": 1,
            "maxItems": 3,
        },
        "dateCompleted": {
            "type": "object",
            "properties": {
                "start": {
                    "type": "string",
                    "format": "date-time"
                },
                "end": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        },
    },
    "required": ["showPending"]
}

module.exports = {
    idSchema,
    getChoreSchema,
    createChoreSchema,
    deleteChoreSchema,
    updateChoreSchema,
    markChoreCompleteSchema,
    listChoreSchema
};