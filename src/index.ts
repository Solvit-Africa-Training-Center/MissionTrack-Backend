import express from 'express';
import { config } from 'dotenv';
import cors from "cors";
import redis from './utils/redis';
import { errorLogger, logger, logStartup } from './utils/logger';
import { database } from './database';
import { routers } from './routes';
import { setupSwagger } from './swagger/swagger';
import path from 'path';
import { setupAssociations } from './database/associations';

config();

const app = express();
app.use(express.json());
// app.use(i18n.init);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(routers);
setupSwagger(app);
redis.connect().catch((err) =>
    logger.error("Redis connection error", { error: err.message, stack: err.stack })
);

const PORT = parseInt(process.env.PORT as string) || 5000;

database.sequelize.authenticate().then(async () => {
    try {
        setupAssociations();

        app.listen(PORT, () => {
            logStartup(PORT, process.env.ENV || 'DEV');
        });
    } catch (error) {
        errorLogger(error as Error, 'Error starting server');
    }
}).catch((error: Error) => {
    errorLogger(error, 'Database connection error');
});

export default app;