const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()

const User=require('./models/User');
const Product=require('./models/Product');
const Vendor=require('./models/Vendor');
const bcrypt=require('bcryptjs');

const PORT=3000
const app=express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully")
).catch(
    (err)=>console.log(err)
)
app.get('/',async(req, res)=>{
    try{
        res.send("<h1 align=center>Welcome to the Backend</h1>")
        res.send("<h2 align=center>database handling</h2>")
    }
    catch(err)
    {
        console.log(err)
    }
})
//http://localhost:3000/register
app.post('/register',async(req,res)=>{
    const {user,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
         const newUser=new User({user,email,password:hashPassword})
         await newUser.save()
        console.log("new user is registered successfully....")
        res.json({message:"User created....."})
         }
    catch(err)
    {
        console.log(err)
    }
})
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email});
        if(!user|| !(await bcrypt.compare(password,user.password)))
        {
         return res.status(400).json({message: "Invalid credentials"});
       }
       res.json({message:"login successfull",username:user.username});
   }
   catch(err)
   {
    console.log(err)
   }
})

app.post('/product',async(req,res)=>{
    const{productName,price,category,description}=req.body;
    try{
        const newProduct=new Product({productName,price,category,description});
        await newProduct.save();
        console.log("Product added successfully");
        res.status(201).json({message:"product added",product:newProduct});

    }
    catch(err)
    {
        console.err(err)
    }
});

app.post('/vendor',async(req,res)=>{
    const{username,email,password}=req.body;
    try{
        const newVendor=new Vendor({username,email,password});
        await newVendor.save();
        console.log("Vendor added successfully");
        res.status(201).json({message:"vendor added",vendor:newVendor});

    }
    catch(err)
    {
        console.err(err)
    }
});


app.listen(PORT,(err)=>{
    if(err){
         console.log(err)
    }
    console.log("Server is running on port|This is Megha:"+PORT)
})