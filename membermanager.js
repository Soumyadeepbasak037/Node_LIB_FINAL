const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const upload = multer()

const memberfile_path = path.join(__dirname,'member.json')

router.get('/view-members',(req,res)=>{
    try{
        data = fs.readFileSync(memberfile_path,'utf-8')
        members = JSON.parse(data)
        res.send(members)
    }
    catch(error){
        res.send(error)
    }
})

router.post('/add-member',upload.none(),(req,res)=>{
    try{
        const data = fs.readFileSync(memberfile_path,'utf-8')
        const members = JSON.parse(data)
        const new_member = {
            id:Date.now(),
            name:req.body.name,
        }
        members.push(new_member)
        // console.log(members)
        fs.writeFileSync(memberfile_path,JSON.stringify(members))
        res.send(members)
    }
    catch(error){
        res.send(error)
    }
})

router.post("/delete",upload.none(),(req,res)=>{
    target_id = req.body.id
    try{
        const data = fs.readFileSync(memberfile_path,'utf-8')
        const members = JSON.parse(data)
        const req_ind = members.findIndex((element)=>element.id === target_id)
        members.splice(req_ind)
        console.log(members)
        fs.writeFileSync(memberfile_path,JSON.stringify(members))
        res.send(members)
    }
    catch(error){
        res.send(error)
    }
})

module.exports = router