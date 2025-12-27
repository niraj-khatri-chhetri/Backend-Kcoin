import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/errorHandler.js';

//Routes
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import blockChainRoutes from './routes/blockchainRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import statRoutes from './routes/statRoutes.js';

//models
import Counter from './models/counter.js';

const app = express();

// ALLOWED DOMAINS LIST
var allowedDomains = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://frontend-kcoin.vercel.app',
];

// CROSS-ORIGIN RESOURCE SHARING (CORS)
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

//HTTP server using express app
const server = http.createServer(app);

const port = process.env.PORT || 8000;

// For ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy settings (if behind a proxy like Nginx)
app.set('trust proxy', true);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(transactionRoutes);
app.use(blockChainRoutes);
app.use(walletRoutes);
app.use(statRoutes);

//Global Error handling middleware
app.use((error, req, res, next) => {
  console.log('🚀 ~ app.use ~ error:', error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Server error';

  res
    .status(error.statusCode)
    .json({ status: error.statusCode, error: error.message });
});

// MONGO DB CONNECTION
mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log('DB connected');
    mongoose.set('strictQuery', false); // Set 'strictQuery' to false

    // Initialize category counter to 100 (only if not present)
    await Counter.updateOne(
      { _id: 'category' },
      { $setOnInsert: { seq: 100 } },
      { upsert: true }
    );
    console.log('Category counter initialized (if not already set).');
  })
  .catch((err) => console.log('DB CONNECTION ERROR: ', err));

const appServer = server.listen(port, () => {
  console.log(`appServer is running on port: ${port}`);
});

app.use(errorHandler);

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the appServer due to Uncaught Exception`);
  process.exit(1);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the appServer due to Unhandled Promise Rejection`);

  appServer.close(() => {
    process.exit(1);
  });
});
