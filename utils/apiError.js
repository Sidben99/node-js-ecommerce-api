class ApiError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = "fail";
        this.isOperational = true;
    }
}

module.exports= ApiError;