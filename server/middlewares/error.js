class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'jsonWebTokenError') {
        const message = 'JSON Web Token is invalid. Try Again!!!';
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is expired. Try Again!!!';
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "CastError") {
        const message = "Resource not found. Invalid:" + err.path;
        err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map((value) => value.message)
            .join(" , ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;