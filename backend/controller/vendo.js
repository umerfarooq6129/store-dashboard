const express = require('express');
const router = express.Router();

const authen = require("../middleware/authen")
require("../db/Database")
const vendor = require("../model/vendo")
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const VendorRegister = require("../model/vendo")

const { jwt } = require("jsonwebtoken")


// router.post('/vendo', async (req, res) => {

//     try {

//         const password = req.body.password;
//         const confirmpassword = req.body.confirmpassword;

//         if (password === confirmpassword) {

//             const vendorSchema = new VendorRegister({
//                 fullname: req.body.fullname,
//                 email: req.body.email,
//                 phoneno: req.body.phoneno,
//                 age: req.body.age,
//                 password: password,
//                 confirmpassword: confirmpassword
//             })

//             const token = await vendorSchema.generateAuthToken();
//             console.log('this is token new ' + token);

//             res.cookie('jwt', token, {
//                 expire: new Date(Date.now() + 600000),
//                 httpOnly: true
//             });
//             console.log(cookie);

//             // const registered = await vendorSchema.save()
//             // console.log(registered);

//             const registered = await vendorSchema.save();
//             console.log(registered);
//             // Handle successful registration (e.g., send a success response)
//             res.status(201).send("Registration successful");
//             // res.status(201).render("index")
//         }
//         else {
//             res.send("password not match")
//         }
//     } catch (e) {

//         res.send(e)
//     }

// })

router.post('/vendo', async (req, res) => {
    try {
      const password = req.body.password;
      const confirmpassword = req.body.confirmpassword;
  
    //   if (password === confirmpassword) {
        const vendorSchema = new VendorRegister({
          fullname: req.body.fullname,
          email: req.body.email,
          phoneno: req.body.phoneno,
          age: req.body.age,
          password: password,
          confirmpassword: confirmpassword,
        });

        console.log(req.body.fullname, req.body.email, req.body.phoneno);
  
        const token = await vendorSchema.generateAuthToken();
        console.log('this is token new ' + token);
  
        res.cookie('jwt', token, {
          expire: new Date(Date.now() + 600000),
          httpOnly: true,
        });
  
        const registered = await vendorSchema.save();
        console.log(registered);
        res.status(201).send("Registration successful");
    //   } else {
        // res.status(400).send("Passwords do not match");
    //   }
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  });

router.get(('/login'), (req, res) => {
    res.render("login")
})

router.post(('/login'), async (req, res) => {
    try {
        const email = req.body.email;
        const passwrod = req.body.password;

        const useremail = await VendorRegister.findOne({ email: email });

        const isMatch = await bcrypt.compare(passwrod, useremail.password);

        const token = await vendorSchema.generateAuthToken();
        console.log('this is token login ' + token);


        res.cookie("jwt", token, {
            expire: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure: true
        });
        console.log(cookie);

        if (isMatch) {
            res.status(201).render("index")
        } else {
            res.send("Wrong password try again")
        }

    } catch (error) {
        res.send(error)
    }
})




router.get('/logout', authen, async (req, res) => {
    try {
        console.log(req.user);

        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        })

        // from all devices logout
        // req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout successful");

        await req.user.save();
        // res.render("login");

    } catch (e) {
        res.send(e);
    }
});


module.exports = router;