class ApiError extends Error{
    constructor(statusCode,message="something went wrong",error=[]){
        super(message);
        this.statusCode =statusCode,
        this.message = message
        this.data = null
        this.errors = this.errors
        this.success = false
    }
}


export {ApiError}