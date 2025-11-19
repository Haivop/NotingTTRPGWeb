"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return ({
        port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '4000', 10),
        database: {
            host: (_b = process.env.POSTGRES_HOST) !== null && _b !== void 0 ? _b : 'localhost',
            port: parseInt((_c = process.env.POSTGRES_PORT) !== null && _c !== void 0 ? _c : '5432', 10),
            user: (_d = process.env.POSTGRES_USER) !== null && _d !== void 0 ? _d : 'noting',
            password: (_e = process.env.POSTGRES_PASSWORD) !== null && _e !== void 0 ? _e : 'noting',
            name: (_f = process.env.POSTGRES_DB) !== null && _f !== void 0 ? _f : 'noting',
            sync: ((_g = process.env.TYPEORM_SYNC) !== null && _g !== void 0 ? _g : 'true').toLowerCase() !== 'false',
        },
        jwt: {
            accessSecret: (_h = process.env.JWT_ACCESS_SECRET) !== null && _h !== void 0 ? _h : 'dev_access_secret',
            refreshSecret: (_j = process.env.JWT_REFRESH_SECRET) !== null && _j !== void 0 ? _j : 'dev_refresh_secret',
            accessTtl: (_k = process.env.JWT_ACCESS_TTL) !== null && _k !== void 0 ? _k : '900s',
            refreshTtl: (_l = process.env.JWT_REFRESH_TTL) !== null && _l !== void 0 ? _l : '7d',
        },
    });
};
