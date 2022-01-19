const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');
//bring all routes
const auth=require('./routes/api/auth');
const profile=require('./routes/api/profile');
const question=require('./routes/api/question');
const app=express();

//middleware for bodyparser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

//config for jwt strategy
require('./strategies/jsonwtStrategy')(passport)

//mongodb config
const db=require('./setup/myurl').mongoUrl;

//attempt to connect to database
mongoose
    .connect(db)
    .then(()=>console.log("database connected successfully"))
    .catch(err=>console.log(err));

//Test-route
app.get('/',(req,res)=>{
    res.send('hey bigstack');
});
//Real routes
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/question',question);

const port=process.env.PORT||3000;

app.listen(port,()=>console.log(`server is running at port ${port}`));