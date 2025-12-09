import express from 'express';
import helmet from "helmet";
import morgan from "morgan";
import sendWa from './send-wa';

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                    "'self'",
                    "https://tfhub.dev",
                    "https://*.tfhub.dev",
                    "https://kaggle.com",
                    "https://*.kaggle.com",
                    "https://storage.googleapis.com",
                    "https://static.cloudflareinsights.com",
                    "https://*.cloudflareinsights.com",
                    "https://*.notify.windows.com",
                    "https://*.windows.com",
                ],
                scriptSrc: ["'self'", "'unsafe-eval'"],
                imgSrc: ["'self'", "data:", "blob:"],
                workerSrc: ["'self'", "blob:"],
            },
        },
    })
);
app.use(morgan("dev"));
app.use(express.json());

app.use('/send-wa', sendWa);

app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
});

export default app;
