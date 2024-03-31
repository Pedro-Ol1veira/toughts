const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const app = express();

//models
const Tought = require('./models/Toughts');
const User = require('./models/User');

//import routes
const toughtsRouter = require('./routes/toughtsRouter');
const authRouter = require('./routes/authRouter');

//db
const conn = require('./db/conn');
//controllers
const ToughtsController = require('./controllers/ToughtsController');
// view engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
// static
app.use(express.static('public'));

// receber resposta pelo body
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

// session midleware

app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
);

// flash message

app.use(flash())

//set session to res

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next()
});




//rotas 
app.use('/toughts', toughtsRouter);
app.get('/', ToughtsController.showToughts);
app.use('/', authRouter);

conn
    .sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));