const express=require("express");
const app=express();
const bodyparser=require("body-parser");
//Loads the handlebars module
const exhbrs=require("express-handlebars");
const dbo=require('./db');
const ObjectID=dbo.ObjectID;

//Sets handlebars configurations
app.engine('hbs',exhbrs.engine({layoutsDir:'views/',defaultLayout:'main',extname:'hbs'}));
//Sets our app to use the handlebars engine
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',async (req,res)=>{
let database=await dbo.getDatabase();
const collection=database.collection('book');
const cursor=collection.find({});
let authors=await cursor.toArray();
//Serves the body of the page aka "main.hbs" to the container
 
let message='';
let edit_id,edit_book;
if(req.query.edit_id){
    edit_id=req.query.edit_id;
    edit_book=await collection.findOne({_id:new ObjectID(edit_id)});
    console.log(edit_book);
}

switch(req.query.status){
case '1':
    message="Inserted successfully";
    break;
case '2':
    message="Updated successfully";
    break;
default:
    break;
}

res.render('main',{message,authors,edit_id,edit_book});
})

app.post('/store_book',async (req,res)=>{
    let database=await dbo.getDatabase();
    const collection=database.collection('book');
    let book={title:req.body.title,author:req.body.author};
    await collection.insertOne(book);
    return res.redirect('/?status=1');
})

app.post('/update_book/:edit_id',async (req,res)=>{
    let database=await dbo.getDatabase();
    const collection=database.collection('book');
    let book={title:req.body.title,author:req.body.author};
    let edit_id=req.params.edit_id;
    await collection.updateOne({_id:new ObjectID(edit_id)},{$set:book});
    return res.redirect('/?status=2');
})

app.listen(8000,()=>{console.log("Listening to port 8000");})