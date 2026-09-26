export const getAllProducts = (req, res) => {
    res.status(200).json({
        message: "All products retrieved successfully"
    })
}

// export const getSingleProduct = (req, res) => {
//     res.status(200).json({
//         message : "Single product retrieved successfully"
//     })
// }