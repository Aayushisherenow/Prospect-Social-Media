
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    };
 
}

export default asyncHandler;



// try catch method
// 
// const asyncHandler = (fn) => (req, res, next) => {
//     try {
        
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//             sucess:  false
//         });
        
//     }
// //   Promise.resolve(fn(req, res, next)).catch(next);
// }