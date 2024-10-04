export default class ApiError extends Error {
    public httpStatus: number;
    
    constructor(message: string, httpStatus: number) {
        super(message);
        this.name = this.constructor.name;
        this.httpStatus = httpStatus; 
    }
}