const express= require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');
const fs = require('fs');
const { log } = require('console');


//store images in disk
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + file.originalname;
    cb(null, file.fieldname + '_' + uniqueSuffix);
  },
})
  
  var upload = multer({ storage: storage ,
  }).single("image");


  router.post("/add", upload,(req,res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });
    // user.save()
    //   .then(() =>{
    //     // res.json({message : 'User Added Successfully', type : success, })
    //     req.session.message = {
    //       type : 'success',
    //       message : 'User Added Successfully!'
    //     }
    //     res.redirect("/");
    //   }).catch((err) => {
    //     res.json({message:err.message , type:"danger"});
    //   })
    // })

    user.save((err) => {
      if(err){
        // res.json({message : 'User Added Successfully', type : success, })
        res.json({message:err.message , type:"danger"});
      }
      else {
        req.session.message = {
          type : 'success',
          message : 'User Added Successfully!'
        }
        res.redirect("/");
      } 
   })
})

//     // get all users route
router.get('/', (req,res) => {
  User.find().exec((err, users) => {
    if(err) {
      res.json({message:err.message});
    }
    else {
      res.render("index", {
      title : 'Home Page',
      users : users,
    });
    }
  })
})


// router.get('/', (req,res) => {
//       User.find().then((users) => {
//       res.render("index", {
//       title : 'Home Page',
//       users : users,
//     });
//     }).catch(() => {
//       // res.json({message:err.message});
//       console.log("error");
//     })
//   })

router.get('/add',(req,res) => {
    res.render('add_users',{title:'Add Users'})
})

router.get('/edit/:id' , (req,res) => {
  let id = req.params.id;
  User.findById(id , (err, user) => {
    if(err){
      res.redirect('/');
    }
    else{
      if(user==null){
        res.redirect('/');
      }
      else{
        res.render('edit_users', {
          title: 'Edit Users',
          user: user,
        })
      }
    }
  })
})

//update user route
router.post('/update/:id' , upload , (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if(req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);     
    }
    catch(err) {
      console.log(err);
    }
  }
  else {
    new_image = req.body.old_image;
  }
  
  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  }, (err, result) => {
    if (err) {
      res.json({message: err.message , type: 'danger'});
    }
    else {
      req.session.message = {
        type: 'info',
        message: "User Updated successfully!",
      }
      res.redirect('/');
    }
  })
})

router.get('/delete/:id', (req,res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if(result.image != ""){
      try{
        fs.unlinkSync('./uploads/' + result.image);
      }
      catch(err){
        comsole.log(err)
      }
    }
    if (err) {
      res.json({message: err.message});
    }
    else {
      req.session.message = {
        type: 'danger',
        message: "User Deleted successfully!",
      }
      res.redirect('/');
    }
    })
  })

module.exports = router;