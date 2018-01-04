const controllerHandler = (promise, params) => async (ctx, next) => {
    const boundParams = params ? params(ctx, next) : [];
    try {
        const result = await promise(...boundParams);

        return ctx.body = result || 'OK' ;
    } catch (error) {
        return ctx.throw();
    }
};
module.exports = controllerHandler;