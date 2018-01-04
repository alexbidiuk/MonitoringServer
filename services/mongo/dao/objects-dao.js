const SecObject = require( '../../../models/object' );


const objectsDAO = (() => {

    const objectFindAndUpdate = async object => {

        return  await SecObject.findOneAndUpdate(
            { _id: object.Id },
            {
                $set: {
                    ...object
                }
            },
            {
                upsert: true,
                new: true,
                returnNewDocument: true,
                setDefaultsOnInsert: true
            }
        );
    };

    return {
        objectFindAndUpdate
    }

}) ();

module.exports = objectsDAO;