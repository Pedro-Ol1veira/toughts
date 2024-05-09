const { where } = require('sequelize');
const Tought = require('../models/Toughts');
const User = require('../models/User');

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        const toughtsData = await Tought.findAll({
            include:User,
        });

        const toughts = toughtsData.map((result) => result.get({plain: true}));

        res.render('tought/home', {toughts});
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

        let emptyToughts = false;

        if (toughts.length === 0) {
            emptyToughts = true;
        }

        res.render('tought/dashboard', { toughts, emptyToughts });
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

    static async removeTought(req, res) {
        const id = req.body.id;
        const userId = req.session.userid;

        try {
            await Tought.destroy({where: {id: id, UserId: userId}});

            req.flash('message', 'Pensamento removido com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })
        } catch (error) {
            console.log(error);
        };
    };

    static async editTought(req, res) {
        const id = req.params.id;

        const tought = await Tought.findOne({where: {id: id}, raw:true});

        res.render('tought/edit', {tought});
    };

    static async postEdit(req, res) {
        const id = req.body.id;
        const tought = {
            title: req.body.title,
        };

        try {
            await Tought.update(tought ,{where: {id: id}});
            req.flash('message', 'Pensamento atualizado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (error) {
            console.log(error);
        }

    };
};