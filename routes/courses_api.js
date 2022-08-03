var express = require('express');
var router = express.Router();
require('dotenv').config()
const Course = require('../models/course');
const async = require('async')


router.get('/v1', function(req, res, next) {
  const course_name=req.query.name || '';
  const page=req.query.page || 1;
  const limitPerPage = 20;
  console.log(course_name)
  async.parallel({
    courses(callback){
      Course
        .find({
          name: {
            '$regex': `.${course_name}.*`,
            '$options': 'i'
          }
        })
        .select({_id:0,name:1, courseUrl:1, averageRating:1, offeredBy: 1})
        .limit(limitPerPage)
        .skip((page-1)*limitPerPage)
        .sort({ averageRating: -1 }).exec(callback)
        // .exec(function(err, courses){
        //   if(err){
        //     return next(err)
        //   }
        //   res.json({count: courses.length, courses: courses, page: page })
        // })
      },
    coursesCount(callback){
      Course
        .find({
          name: {
            '$regex': `.${course_name}.*`,
            '$options': 'i'
          }
        }).count().exec(callback)
    }
  }, function(err, results){
    if(err) { return next(err) }
    if(!results || results.length==0){
      const err = new Error('No results found')
      err.status = 404
      return next(err);
    }
    res.json({count: results.coursesCount, courses: results.courses, page: page })
  })
});

module.exports = router;