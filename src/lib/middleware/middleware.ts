import Cors from 'cors';

// Initialize the CORS middleware with desired options
const cors = Cors({
    origin: ["http://localhost:3000", "https://bingus.website"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});


// Helper function to wait for the middleware to run
function runMiddleware(req: any, res: any, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default cors;
export { runMiddleware };
