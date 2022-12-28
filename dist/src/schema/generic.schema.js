"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const genericSchema = {
    genericString: zod_1.z.string().min(0).max(5000),
    genericEmail: zod_1.z.string().email().min(0).max(70),
    genericUuid: zod_1.z.string().uuid(),
};
exports.default = genericSchema;
//# sourceMappingURL=generic.schema.js.map