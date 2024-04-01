const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { use } = require('../routes/toughtsRouter');


module.exports = class AuthController {


    static login(req, res) {
        res.render('auth/login');
    };

    static register(req, res) {
        res.render('auth/register');
    };

    static async registerPost(req, res) {
        const {name, email, password, confirmpassword} = req.body;

        // password match validation
        if(password != confirmpassword) {
            //mensage
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');

            return;
        }

        //check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}});

        if (checkIfUserExists) {
            req.flash('message', 'E-mail ja está em uso!');
            res.render('auth/register');

            return;
        }

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        };

        try {
            await User.create(user);

            //inicializar a sessao
            req.session.userid = user.id;

            req.flash('message', 'Cadastro realizado com sucesso!');

            req.session.save(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.log(error);
        }

    };
    
};