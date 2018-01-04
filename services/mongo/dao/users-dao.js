const User = require( '../../../models/user' );


const patrolsDAO = (() => {

    const patrolFindAndUpdate = async patrol => {

       return  await User.findOneAndUpdate(
            { _id: patrol.Id },
            { $set: { ...patrol } },
            {
                upsert: true,
                setDefaultsOnInsert: true
            }
        );
    };

    const userChangePass = async (id, password) => {

        return await User.updateOne(
            { '_id': id },
            {
                $set: {
                    'Password': password
                }
            }
        );
    };

    return {
        patrolFindAndUpdate,
        userChangePass
    }

}) ();

module.exports = patrolsDAO;