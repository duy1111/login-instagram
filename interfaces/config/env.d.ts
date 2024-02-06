declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    MONGO_URI: string;
    DB_NAME: string;
    NODE_ENV: "dev" | "prod";
    BCRYPT_SALT: number;
    APP_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    JWT_EXPIRE_GUEST: string;
    MITTO_API_KEY: string;
    MOYASAR_PUBLISHABLE_KEY: string;
    MOYASAR_SECRET_KEY: string;
    MOYASAR_SECRET_TOKEN: string;
    LOGEX_API_KEY: string;
    LOGEX_URL: string;
  }
}
