const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const upload = multer()
const bookfile_path = path.join(__dirname,'books.json')


router.use(express.json())



router.get('/view-books',(req,res)=>{
    try{
        data = fs.readFileSync(bookfile_path,'utf-8')
        books = JSON.parse(data)
        res.send(books)
    }
    catch(error){
        res.send(error);
    }
})

router.post('/add-book',upload.none(),(req,res)=>{
    const data = fs.readFileSync(bookfile_path,'utf-8')
    const books = JSON.parse(data)

    const new_book = {
        title:req.body.title,
        author:req.body.author,
        id:Date.now().toString()
    }
    books.push(new_book),
    fs.writeFileSync(bookfile_path,JSON.stringify(books))
    res.send(`${new_book.title} was added.`)
})

router.post('/book_id',upload.none(),(req,res)=>{
    const target_id = req.body.id;
    try{
        const data = fs.readFileSync(bookfile_path,'utf-8')
        const books = JSON.parse(data)
        const req_ind = (books.findIndex((element)=>element.id === target_id))
        res.send(books[req_ind])
    }
    catch(error){
        res.send(error)
    }
})

router.post('/delete',upload.none(),(req,res)=>{
    const target_id = req.body.id;
    try{
        const data = fs.readFileSync(bookfile_path,'utf-8')
        const books = JSON.parse(data)
        const req_ind = books.findIndex((element)=>element.id === target_id)
        books.splice(req_ind)
        console.log(books)
        fs.writeFileSync(bookfile_path,JSON.stringify(books))
        res.send(books)
    }
    catch(error){
        res.send(error)
    }
})

router.post('/update',upload.none(),(req,res)=>{
    const target_id = req.body.id
    console.log(target_id)
    try{
        const data = fs.readFileSync(bookfile_path,'utf-8')
        const books = JSON.parse(data)
        const req_ind = books.findIndex((element)=>element.id === target_id) 
        console.log(req_ind)
        if(req_ind != -1){
            books[req_ind].title = req.body.title
            books[req_ind].author = req.body.author
            fs.writeFileSync(bookfile_path,JSON.stringify(books))
            res.send("Books Updated successfully") 
        }
        else{
            res.send("Book not found")
        }
    }
    catch(error){
        res.send(error)
    }
})

module.exports = router;

