const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const Movie = require("../Models/Movie");



exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Username" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    const user = await User.findOne({ username: username });
    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        const date = new Date().toLocaleString()
        await User.findOneAndUpdate({ username: username }, { lastaccess: date })
        const token = jwt.sign({ _id: user._id }, "JWT_SECRET");
        return res
          .status(200)
          .json({ success: true, message: "Login Success", data: user, token });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Crediantials" });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Not a registered user",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
    
};

exports.upload = async (req,res) => {
  try {
    const { id,name,type,value,genera,duration,image,ep,language,description,id2,server } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter ID" });
    }
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter name" });
    }
    if (!value) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter date" });
    }
    if (!genera) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter genera" });
    }
    if (!duration) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter duration" });
    }
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Please Upload image" });
    }
    if (!language) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter languages" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter description" });
    }
    // const moviee = await Movie.findOne({ id: id });
    // if(!moviee) {
      
      const docs = new Movie({id,name,genera,duration,image,type,date:value,ep,language,description,id2,server})
      await docs.save()
      res.status(200).json({
        success:true,
        message:'Movie uploaded xD'
      })
    // } else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "id already exists",
    //   });
    // }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.getdata = async (req,res) => {
  try{
    const docs = await Movie.find({})
      res.status(200).json({
        success:true,
        data:docs,
      })    
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.editdata = async (req,res) => {
  try{
    const { _id,id,name,type,value,genera,duration,image,language,description,id2,server } = req.body;
    await Movie.findByIdAndUpdate(_id,{id:id,image:image,date:value,type:type,image:image,duration:duration,name:name,genera:genera,language:language,description:description,id2:id2,server:server})
    res.status(200).json({
      success:true,
      message:'Edited xD'
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.deletedata = async (req, res) => {
  const selected = req.body.selected
  selected.map( async (item)=>{
      Movie.findOneAndDelete({name:item}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
          console.log(docs)    
        }
    });
    })
  res.send({status:'success',message:'Data deleted successfully'})

};