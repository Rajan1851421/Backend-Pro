export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };


// or

// const asyncHandler =(fn)=>async(req,rse,next)=>{
// try {
//     await fn(req,res,next)
// } catch (error) {
//     res.status(error.code ||500),json({
//         success:false,
//         message:error.message
//     })
// }
// }