var express = require('express');
var router = express.Router();
require('dotenv').config()
const Course = require('../models/course');
const async = require('async')
const { validationResult } = require('express-validator')


router.get('/v1', function(req, res, next) {
  const errors= validationResult(req);
  const course_name=req.query.name || '';
  const page=req.query.page || 1;
  const limitPerPage = 20;
  // console.log(course_name);
  if(!errors.isEmpty()){
    let err = new Error('Error in input')
    err.status=400
    return next(err)
  }else{
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
      // if(results.courses.length==0 || results.coursesCount==0){
      //   res.json({message: 'No courses found'})
      // }
      res.json({totalCount: results.coursesCount, courses: results.courses, page: page })
    })
  }
});

module.exports = router;