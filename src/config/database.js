import dotenv from 'dotenv'
dotenv.config()

export default {
    dialect: "postgres",
    host: process.env.PG_HOST,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD, 
    database: process.env.PG_DATABASE,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false,
        },
    },
    
}