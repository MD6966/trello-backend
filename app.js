const express = require('express');
const app = express();
const errorMiddleWare = require('./middlewares/errors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
// Import routes here
const auth = require('./routes/auth');
const board = require('./routes/board');
const list = require('./routes/list')
const card = require('./routes/card')
const email = require('./routes/email')
const send_mail = require("./routes/sendEmail");
const checkList = require('./routes/checklist');


app.use('/api/v1/', board)
app.use('/api/v1/auth', auth)
app.use('/api/v1', list)
app.use('/api/v1', card)
app.use('/api/v1', email)
app.use('/api/v1', send_mail)
app.use('/api/v1', checkList)







app.use(errorMiddleWare);

module.exports = app