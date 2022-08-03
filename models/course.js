var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CourseSchema = new Schema(
    {
        "courseId": String,
        "name": String,
        // "averageRating": mongoose.Decimal128,
        "averageRating": Number,
        "userCount": Number,
        "offeredBy": [String],
        "courseUrl": String,
        "platform": String,
        "subject": String,
        "language": String,
        "free": Boolean
    }
);

//virtual for getting url of Course
// CourseSchema
// .virtual('url')
// .get(function(){
//     return '/courses/course/'+this._id
// })

//Export Model
module.exports = mongoose.model('courses', CourseSchema);