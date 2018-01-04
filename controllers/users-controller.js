const usersDAO = require('../services/mongo/dao/users-dao');

const usersController = (() => {

    const changeUserPass = async (id, pass, ) => {

        try {

           await usersDAO.userChangePass(id, pass);

           return Promise.resolve()
                .then(() => 'Пароль успешно изменен.');

        } catch (err) {
            throw new Error(err);
        }

    };

    return {
        changeUserPass
    }

}) ();

module.exports = usersController;