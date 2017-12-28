const DB = 'mmsdb';

const PROCEDURE_NAMES = {
    login: `${DB}.dbo.usp_Login`,
    getPatrols: `${DB}.dbo.usp_GetPatrols`,
    getObject: `${DB}.dbo.usp_GetObject`,
    getObjectImages: `${DB}.dbo.usp_GetObjectImages`,
    getEvents: `${DB}.dbo.usp_GetEvents`
}

module.exports = PROCEDURE_NAMES;