const mkdirp = require('mkdirp-promise');
const fs = require('fs');
const richTextParser = require('./utils/richTextParser');

const serverConfig = require('../config/server');
const objectsDAO = require('./mongo/dao/objects-dao');


const objectsService = (() => {


    const objectEntityHandler = async (object, objectPics) => {

        try {
            let objDir = `${global.__basedir}\\${serverConfig.publicFolderPath}\\${object.Id}`;

            let objImgs=[];

            await mkdirp(objDir);

            objectPics.forEach( ( pic, i ) => {

                objImgs.push( `${object.Id}/${object.Id}_${i}.jpg` );

                fs.writeFile( `${objDir}\\${object.Id}_${i}.jpg`, pic.data, err => {
                    if (err) console.log('writeFile error', err );
                });
            });

            let finalObj = { ...object };
            finalObj.Description = richTextParser.rtf2text(object.Description);
            finalObj.Pics = objImgs;


            return await objectsDAO.objectFindAndUpdate(finalObj);

        } catch (err) {
            console.log(err);
        }

    };
    return {
        objectEntityHandler
    }

}) ();

module.exports = objectsService;