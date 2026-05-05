export const asyncHandler=(theFunction) =>(req,res,next)=>{
    Promise.resolve(theFunction(req,res,next)).catch(next);
};

/*export const asyncHandler = (theFunction) => {
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};*/