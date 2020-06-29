const db = require("../models");

module.exports = {
    findAll: function (req,res) {
        console.log("getting movements")
        db.Movement
            .find(req.query)
            .then(dbModel => {
                console.log(dbModel)
                res.json(dbModel)})

            .catch(err => res.status(422).json(err));
    }
}