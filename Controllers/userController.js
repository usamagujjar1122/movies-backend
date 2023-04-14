const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const User = require('../Models/userModel');
const Deposit = require("../Models/Deposits");
const WithdraW = require("../Models/Withdraw");
const Msgs = require("../Models/Msgs");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // user: "e4a.live.official@gmail.com",
    // pass: "fjvieqmasuuwwvrd",
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,

  },
});

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password, cpassword, referedby, otp, cotp } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Full Name" });
    }
    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter User Name" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email" });
    }
    if (otp != cotp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid otp" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    if (password !== cpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password match failed" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must have 8 characters" });
    }

    const fuser = await User.findOne({ email: email });
    if (fuser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered please login to continue",
      });
    }
    const fusername = await User.findOne({ username: username });
    if (fusername) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }
    if (referedby) {
      const fusername = await User.findOne({ username: referedby });
      if (!fusername) {
        return res
          .status(400)
          .json({ success: false, message: "Invlaid referal code" });
      }
    }
    const p = await bcrypt.hash(password, 12);
    const user = new User({ name, username, email, password: p, referedby });
    const userdata = await user.save();
    // const stat = new Stat({ user: userdata, actived: 0, lastd: 0, totald: 0, pendingw: 0, lastw: 0, totalw: 0, earned: 0,commision:0 })
    // await stat.save()
    // transporter.sendMail({
    //   from: process.env.EMAIL,
    //   to: user.email,
    //   subject: "Welcome to DAGON FINANCE",
    //   html: `
    //       <h3>Hi, ${name}</h3>
    //       <p>Welcome to DAGON FINANCE. Your email is ${email}. Feel free to invest with us.</p>
    //       <h3>Best Regards</h3>
    //       <h4>85th Floor, Lower Manhattan, Suite 8500,New York, NY 10007, USA</h4>
    //       <h3>Best Regards</h3>
    //       <h4>85th Floor, Lower Manhattan, Suite 8500,New York, NY 10007, USA</h4>
    //       <h3>DAGON FINANCE Team</h3>
    //       <p style="font-weight:bold;background-color:silver;">@ DAGON FINANCE 2023</p>
    //       `
    // })
    return res.status(200).json({
      success: true,
      message: "Account Created Successfully. Please Login To Continue",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

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

exports.loaduser = async (req, res) => {
  const token = req.body.token
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  const docs = await User.findById(_id)
  if(docs){
  try {
    const refs = await User.find({ referedby: docs.username })
    res.status(200).json({
      success: true,
      data: docs,
      refs
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
} else {
  return res.status(200).json({ success: false, message: 'Invalid Token' });}
}

exports.history = async (req, res) => {
  const token = req.body.token
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  try {
    const docs = await User.findById(_id)
    const deposits = await Deposit.find({ username: docs.username })
    const withdraws = await WithdraW.find({ username: docs.username })
    res.status(200).json({
      success: true,
      deposits,
      withdraws,
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.updateprofile = async (req, res) => {
  const { token, name, country } = req.body
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter your name" });
  }
  if (!country) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter your country" });
  }
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  try {
    const docs = await User.findByIdAndUpdate(_id, { name: name, country: country })
    res.status(200).json({
      success: true,
      message: 'Profile updated'
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.updatepassword = async (req, res) => {
  const { token, password, opassword, cpassword } = req.body
  if (!opassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter old password" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter new password" });
  }
  if (!cpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter confirm password" });
  }
  if (password != cpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Please match failed" });
  }
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  const p = await bcrypt.hash(password, 12);
  try {
    const docs = await User.findByIdAndUpdate(_id, { password: p })
    res.status(200).json({
      success: true,
      message: 'Password changed'
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.referals = async (req, res) => {
  const token = req.body.token
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  let refs = [[], [], [], [], [], [], [], [], []]
  let current = null
  const { username } = await User.findById(_id)
  current = username
  try {
    for (let i = 0; i < 8; i++) {
      if (i === 0) {
        refs[i] = await User.find({ referedby: current })
      } else {
        for (let j = 0; j < refs[i - 1].length; j++) {
          current = refs[i - 1][j].username
          refs[i] = refs[i].concat(await User.find({ referedby: current }))
        }
      }
    }
    return res.status(200).json({ success: true, data: refs });


  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.deposit = async (req, res) => {
  const { token, trxID, image, method, amount } = req.body
  if (!trxID) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter transaction ID" });
  }
  if (!amount) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter amount in $" });
  }
  if (amount < 10) {
    return res
      .status(400)
      .json({ success: false, message: "Minimum withdraw amount in $10" });
  }
  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload screenshot of payment" });
  }
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  try {
    const { username } = await User.findById(_id)
    const doc = await Deposit.findOne({ username: username, status: 'pending' })
    if (doc) {
      return res
        .status(400)
        .json({ success: false, message: "You already have a pending deposit" });
    }
    const deposit = new Deposit({ username, trxID, image, method, amount })
    await deposit.save()
    res.status(200).json({
      success: true,
      message: 'Deposit request sent'
    })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.withdraw = async (req, res) => {
  const { token, waddress, wmethod, wamount } = req.body
  if (!waddress) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter withdraw address" });
  }
  if (!wamount) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter amount" });
  }
  if (wamount < 10) {
    return res
      .status(400)
      .json({ success: false, message: "Miniumun withdraw amount in $10" });
  }
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  try {
    const { username, balance } = await User.findById(_id)
    if (balance < wamount) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough balance" });
    } else {
      const doc = await WithdraW.findOne({ username: username, status: 'pending' })
      if (doc) {
        return res
          .status(400)
          .json({ success: false, message: "You already have a pending withdrawl" });
      }
      const deposit = new WithdraW({ username, address: waddress, method: wmethod, amount: wamount })
      const user = await User.findByIdAndUpdate(_id, { $inc: { balance: -wamount } })
      await deposit.save()
      res.status(200).json({
        success: true,
        message: 'Withdrawl request sent'
      })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

exports.vip = async (req, res) => {
  const { token, price, level } = req.body
  const { _id } = (JSON.parse(atob(token.split('.')[1])))
  const user = await User.findById(_id)
  if (user.balance < price) {
    res.status(400).json({
      success: false,
      message: 'Insufficient balance'
    })
  } else {
    try {
      await User.findByIdAndUpdate(_id, { $inc: { balance: -price }, vip: level, active: true })
      let current = user.referedby
      let denom
      if(current){
      for (let i = 0; i < 8; i++) {
        switch (i) {
          case 0:
            denom = 4
            break;
          case 1:
            denom = 6.66666666
            break;
          case 2:
            denom = 10
            break;
          case 3:
            denom = 12.5
            break;
          case 4:
            denom = 16.66666666
            break;
          case 5:
            denom = 25
            break;
          case 6:
            denom = 33.33333333
            break;
          case 7:
            denom = 50
            break;
          default:
            break;
        }
        const d = await User.findOne({username:current})
        if(d.vip===1){
        const data = await User.findOneAndUpdate({ username: current }, { $inc: { balance: +(price / denom).toFixed(2) } })
        if (data.referedby) {
          current = data.referedby
        } else {
          break;
        }
      } else if(d.referedby) {
        current = d.referedby
      } else {
        break;
      }
      }
      }
      res.status(200).json({
        success: true,
        message: 'Membership upgraded'
      })
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
// exports.upload = async (req,res) => {
//   try {
//     const { id,name,type,value,genera,duration,image,ep,language,description,id2,server } = req.body;
//     if (!id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter ID" });
//     }
//     if (!name) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter name" });
//     }
//     if (!value) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter date" });
//     }
//     if (!genera) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter genera" });
//     }
//     if (!duration) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter duration" });
//     }
//     if (!image) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Upload image" });
//     }
//     if (!language) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter languages" });
//     }
//     if (!description) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter description" });
//     }
//     // const moviee = await Movie.findOne({ id: id });
//     // if(!moviee) {

//       const docs = new Movie({id,name,genera,duration,image,type,date:value,ep,language,description,id2,server})
//       await docs.save()
//       res.status(200).json({
//         success:true,
//         message:'Movie uploaded xD'
//       })
//     // } else {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "id already exists",
//     //   });
//     // }
//   } catch (error) {
//     console.log(error)
//     return res.status(400).json({ success: false, message: error.message });
//   }
// }

// exports.getdata = async (req,res) => {
//   try{
//     const docs = await Movie.find({})
//       res.status(200).json({
//         success:true,
//         data:docs,
//       })    
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// }

// exports.editdata = async (req,res) => {
//   try{
//     const { _id,id,name,type,value,genera,duration,image,language,description,id2,server } = req.body;
//     await Movie.findByIdAndUpdate(_id,{id:id,image:image,date:value,type:type,image:image,duration:duration,name:name,genera:genera,language:language,description:description,id2:id2,server:server})
//     res.status(200).json({
//       success:true,
//       message:'Edited xD'
//     })
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// }

// exports.deletedata = async (req, res) => {
//   try {
//     const selected = req.body.selected
//   selected.map( async (item)=>{
//       Movie.findOneAndDelete({name:item}, function (err, docs) {
//         if (err){
//             console.log(err)
//         }
//         else{
//           console.log(docs)    
//         }
//     });
//     })
//   res.send({status:'success',message:'Data deleted successfully'})
// } catch (error) {
//   return res.status(400).json({ success: false, message: error.message });

// }
// };

exports.sendmail = async (req, res) => {
  console.log('requested')
  try {
    const otp = Math.floor(100000 + Math.random() * 900000)
    await transporter.sendMail({
      to: req.body.email,
      from: "e4a.live.official@gmail.com",
      subject: "E4A OTP Verification",
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">E4A</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing E4A. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Entertainment4All</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>E4A Inc</p>
        </div>
      </div>
    </div>
            `,
    });
    console.log('sent')
    return res.status(200).json({ success: true, otp: otp })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}


exports.getmsgs = async (req, res) => {
  try {
    const docs = await Msgs.find({})
    if (docs) {
      res.status(200).json({ success: true, data: docs })
    } else {
      res.status(400).json({ success: false })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getusers = async (req, res) => {
  try {
    const docs = await User.find({})
    if (docs) {
      res.status(200).json({ success: true, data: docs })
    } else {
      res.status(400).json({ success: false })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getdeposits = async (req, res) => {
  try {
    const docs = await Deposit.find({ status: 'pending' })
    if (docs) {
      res.status(200).json({ success: true, data: docs })
    } else {
      res.status(400).json({ success: false })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getwithdraws = async (req, res) => {
  try {
    const docs = await WithdraW.find({ status: 'pending' })
    if (docs) {
      res.status(200).json({ success: true, data: docs })
    } else {
      res.status(400).json({ success: false })
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


exports.msg = async (req, res) => {
  const { msg, token } = req.body
  if((!msg)){
    res.status(400).json({ success: false, message: 'Please Enter your message' })
  }
  try {
    const { _id } = (JSON.parse(atob(token.split('.')[1])))
    const user = await User.findById(_id)
    const already = await Msgs.find({ email: user.email })
    console.log(already)
    if (already.length === 0) {
      const docs = new Msgs({ name: user.name, email: user.email, msg: msg })
      await docs.save()
      if (docs) {
        res.status(200).json({ success: true, message: 'Message sent successfully' })
      } else {
        res.status(400).json({ success: false, message: 'Message sending failed' })
      }
    } else {
      return res.status(400).json({ success: false, message: 'You already have a query pending!' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.read = async (req, res) => {
  const { item } = req.body
  try {
    const user = await Msgs.findByIdAndUpdate(item._id, { status: 'read' })
    if (user) {
      res.status(200).json({ success: true, message: 'Message read' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.approveDeposit = async (req, res) => {
  const { item } = req.body
  try {
    await User.findOneAndUpdate({ username: item.username }, { $inc: { balance: +item.amount, tdeposit: +item.amount  } })
    const deposit = await Deposit.findByIdAndUpdate(item._id, { status: 'approved' })
    if (deposit) {
      res.status(200).json({ success: true, message: 'Approved' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.cancleDeposit = async (req, res) => {
  const { item } = req.body
  try {
    const user = await Deposit.findByIdAndUpdate(item._id, { status: 'rejected' })
    if (user) {
      res.status(200).json({ success: true, message: 'Cancled' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.approveWithdraw = async (req, res) => {
  const { item } = req.body
  try {
    const deposit = await WithdraW.findByIdAndUpdate(item._id, { status: 'approved' })
    await User.findOneAndUpdate({username:item.username},{$inc: { twithdraw: +item.amount }})
    if (deposit) {
      res.status(200).json({ success: true, message: 'Approved' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.cancleWithdraw = async (req, res) => {
  const { item } = req.body
  try {
    const userr = await User.findOneAndUpdate({ username: item.username }, { $inc: { balance: +item.amount } })
    const user = await WithdraW.findByIdAndUpdate(item._id, { status: 'rejected' })
    if (user) {
      res.status(200).json({ success: true, message: 'Cancled' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.delmsg = async (req, res) => {
  const { item } = req.body
  try {
    const user = await Msgs.findByIdAndDelete(item._id)
    if (user) {
      res.status(200).json({ success: true, message: 'Message deleted' })
    } else {
      return res.status(400).json({ success: false, message: 'Failed' });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};