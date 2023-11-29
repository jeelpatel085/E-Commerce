const mongoose  = require('mongoose')

const validatemongodbid = (id,res) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid){
        res.json({
            message: 'this id is not valid or not found'
        })
    }
}


module.exports = validatemongodbid;