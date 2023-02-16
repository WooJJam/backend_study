const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const postSchema = new Schema({
    /*
    글 번호
    제목
    내용
    작성일
    작성자 -> 외래키
    */
    _id :{ 
        type:Number,
        unique:true
    },
    subject: String,
    content: String,
    createdAt:  {
        type: Date,
        default: Date.now
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', postSchema);