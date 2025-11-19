"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = __importDefault(require("./config/configuration"));
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const worlds_module_1 = require("./worlds/worlds.module");
const tokens_module_1 = require("./tokens/tokens.module");
const discovery_module_1 = require("./discovery/discovery.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const dbConfig = configService.get('database');
                    return {
                        type: 'postgres',
                        host: dbConfig.host,
                        port: dbConfig.port,
                        username: dbConfig.user,
                        password: dbConfig.password,
                        database: dbConfig.name,
                        autoLoadEntities: true,
                        synchronize: dbConfig.sync,
                        logging: false,
                    };
                },
            }),
            tokens_module_1.TokensModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            worlds_module_1.WorldsModule,
            discovery_module_1.DiscoveryModule,
        ],
    })
], AppModule);
