const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jsonwt=require('jsonwebtoken');
const passport=require('passport');
const key=require('../../setup/myurl');

//@type     GET
//@route    /api/auth
//@desc     just for testing
//@aceess   PUBLIC
router.get('/',(req,res)=>res.json({test:"auth is succes"}));

//import schema for a person to register
const Person=require('../../models/Person');

//@type     Post
//@route    /api/auth/register
//@desc     register the user
//@aceess   PUBLIC
router.post('/register',(req,res)=>{
    Person.findOne({email: req.body.email})
        .then(person=>{
            if(person){
                return res
                    .status(400)
                    .json({emailerror:"email is already registered"});
            }else {
                const newPerson=Person({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                });
                if(req.body.gender){
                    newPerson.gender=req.body.gender;
                    if(req.body.gender=='female'){
                        newPerson.profilepic='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7M-ARUYOC5WNHiq2EI9474QQvdWGb7-Pj1w&usqp=CAU';
                    }
                }
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newPerson.password, salt, (err, hash)=> {
                        // Store hash in your password DB.
                        if(err)throw err;
                        newPerson.password=hash;
                        newPerson
                            .save()
                            .then(person=>res.json(person))
                            .catch(err=>console.log(err));
                    });
                });
            }
        })
        .catch(err=>console.log(err));
});

//@type     Post
//@route    /api/auth/login
//@desc     login the user
//@aceess   PUBLIC
router.post('/login',(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    Person.findOne({email})
        .then(person=>{
            if(!person){
                return res.status(400).json({emailerr:'email not found'});
            }
            bcrypt
                .compare(password,person.password)
                .then(isCorrect=>{
                    if(isCorrect){
                        //res.json({success:"user logged in"});
                        //use payload and create token for user
                        const payload={
                            id:person.id,
                            name:person.name,
                            email:person.email
                        };
                        jsonwt.sign(
                            payload,
                            key.secret,
                            {expiresIn:3600},
                            (err,token)=>{
                                if(err){
                                    res.json({
                                        success:false
                                    });
                                    throw err;
                                }else {
                                    res.json({
                                        success:true,
                                        token:"Bearer "+token
                                    });
                                }
                            }
                        );
                    }else {
                        res.status(400).json({password:"paswword not matched"});
                    }
                })
                .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
});

//@type     GET
//@route    /api/auth/profile
//@desc     route for the user profile
//@aceess   PRIVATE
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //console.log(req);
    res.json(req.user);
});

module.exports=router;