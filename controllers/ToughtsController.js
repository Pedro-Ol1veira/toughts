const Tought = require('../models/Toughts');
const User = require('../models/User');

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('tought/home');
    };

    static async dashboard(req, res) {
        res.render('tought/dashboard');
    };

    static createTought(req, res) {
        res.render('tought/create');
    };
};