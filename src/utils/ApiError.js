class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong.",
        errors = [],
        stack =""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.sucess = false
        this.errors = errors

        if(statck){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}