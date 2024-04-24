const Tought = require('../models/Toughts');
const User = require('../models/User');

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('tought/home');
    };

    static async dashboard(req, res) {
        const userId = req.session.userid;

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought,
            plain: true,
        });

        if(!user) {
            res.redirect('/login');
        }

        const toughts = user.Toughts.map((result) => result.dataValues);

        res.render('tought/dashboard', { toughts });
    };

    static createTought(req, res) {
        res.render('tought/create');
    };

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        };

        try {
            await Tought.create(tought);

            req.flash('message', 'Pensamento criado com sucesso');

            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            }); 
        } catch (error) {
            console.log(error);
        }
    };
};