const usersDAO = require('./mongo/dao/users-dao');

const patrolsService = (() => {

    const patrolEntityHandler = async patrol => {

        try {

            await usersDAO.patrolFindAndUpdate(patrol);

        } catch (err) {
            console.log(err);
        }

    };

    return {
        patrolEntityHandler
    }

}) ();

module.exports = patrolsService;