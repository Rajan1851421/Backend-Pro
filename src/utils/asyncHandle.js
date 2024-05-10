const asyncHandler=(requstHadler)=>{
   return (req,res,next)=>{
        Promise.resolve(requstHadler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}


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