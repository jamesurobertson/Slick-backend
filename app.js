const express = require('express')
const morgan = require("morgan");
const { environment } = require('./config');
const cors = require('cors');
const db = require('./db/models')

const messageRouter = require('./routes/message')
const channelRouter = require('./routes/channels')
const userRouter = require('./routes/users')
const awsRouter = require('./routes/aws')

const app = express();

app.use(morgan("dev"));
app.use(express.json());
const origin = process.env.FRONTEND_URL;
app.use(cors({ origin }));

app.use('/channel', channelRouter)
app.use('/user', userRouter)
app.use('/message', messageRouter)
app.use('/aws', awsRouter)


app.get('/', (req, res) => {
    res.send('Hello, World!')
})

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.status = 404;
    err.errors = ["Could not find string of resource"]
    next(err);
});

// Custom error handlers.

// Generic error handler.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});


module.exports = app;
