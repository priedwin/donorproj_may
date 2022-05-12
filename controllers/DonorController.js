const  Donor = require('../models/donor.model')
var getdonor = require('../fabcar/javascript/query_donation')
let network = require('../fabcar/javascript/invoke_donation')

const path = require('path');
//const fs = require('fs');
let donorreg = require('../fabcar/javascript/invoke_donorregis')
var getdonorreg = require('../fabcar/javascript/query_donordetails')
var getdonorbank = require('../fabcar/javascript/query_donorbankbag')
let donorbag = require('../fabcar/javascript/invoke_donorbloodbag')



var getbloodtesting = require('../fabcar/javascript/query_bloodtesting')
let bloodtest = require('../fabcar/javascript/invoke_bloodtesting')

var gettransfusion = require('../fabcar/javascript/query_transfusion')
let bloodtrans = require('../fabcar/javascript/invoke_transfusion')

String.prototype.toDate = function(format, delimiter) {
    var date = this;
    var formatedDate = null;
    var formatLowerCase = format.toLowerCase();
    var formatItems = formatLowerCase.split(delimiter);
    var dateItems = date.split(delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var d = dateItems[dayIndex];
    if (d < 10) {
    	d = "0"+ d;
    }
    if (monthIndex > -1) {
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        if (month < 10) {
            month = "0" + month;
        }
        formatedDate = new Date(dateItems[yearIndex], month, d);
    } 
    
    return formatedDate;
};

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

//view all the donors
const viewDonor = (req,res) => {
    Donor.find()
    .then(response => {
        res.json({
            response
        })
        console.log(response)
    })
    .catch(error => {
        res.json({
            message: 'An error oocured!'
        })
    })
}

const show=(req,res,next) => {
    let donorid = req.body.donorid
    Donor.find({donorid:donorid})
    .then(response => {
        res.json({
            response
        })
        console.log(response)
    })
    .catch(error => {
        res.json({
            message: 'An eror occured!'
        })
    })
}

const store=(req,res,next) => {
    var donordetails = req.body
   let donor = new Donor({
    donorid: donordetails.donorid,
    donorname: donordetails.donorname,
    password: donordetails.password,
    email:  donordetails.email,
    mobile: donordetails.mobile,
    dob: new Date (donordetails.dob),
    gender: donordetails.gender
   })
    donor.save() //mongo db 
    .then(response => {
        console.log("added !!!!")
        res.json({
           message: 'donor added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

//update Donor Details
const update = (req,res,next) => {
    let id = req.body.id
    var donordetails = req.body
    let updatedData = {
        donorname: donordetails.donorname,
        password: donordetails.password,
        email:  donordetails.email,
        mobile: donordetails.mobile,
        gender: donordetails.gender
    }
    Donor.findByIdAndUpdate(id, {$set: updatedData})

    .then(response => {
        console.log("updated")
        res.json({
           message: 'donor details updated successfully!'
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            message: 'An error occured!'
        })
    })
}

const destroy = (req,res,next) => {
    let id = req.body.id
    console.log(id)
    Donor.findByIdAndDelete(id)
    .then(() => {
        console.log('Deleted')
        req.json({
            message: 'Employee delected successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

function calculateAge(year, month, day) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getUTCMonth() + 1;
    var currentDay = currentDate.getUTCDate();
    // You need to treat the cases where the year, month or day hasn't arrived yet.
    var age = currentYear - year;
    if (currentMonth > month) {
        return age;
    } else {
        if (currentDay >= day) {
            return age;
        } else {
            age--;
            return age;
        }
    }
}

exports.saveDonorRegDetails = async(req,res,next) => {
    console.log("inside controller")
    let donorid = req.body.donorid
    let lastdonated=req.body.lastdonated
    let bloodbanks=req.body.bloodbanks
     let flag=0
    var donorstring =JSON.stringify(req.body.donordetails);
    
    const newdonor =({
        donorid: donorid,
        lastdonated: lastdonated,
        bloodbanks:bloodbanks,
        donorstring: donorstring,
   });
   donorreg.saveDonorRegDetails(newdonor,flag);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.changeDonorRegDetails = async(req,res,next) => {
    console.log("inside controller")
    let flag=1;
    let donorid = req.body.donorid
    let lastdonated=req.body.lastdonated   
   let nextdonation;
    let result1 =await getdonorreg.getDonorDetails(donorid);
    let transactionstring1 = JSON.parse(result1.toString());
     let gender=transactionstring1.gender;
     let d=lastdonated.toDate("dd-MM-yyyy", "-");
    if(gender=='Male')
    {
      nextdonation=d.addDays(90);
    } else
    {
      nextdonation=d.addDays(120);
    }
    const newdonor =({
        donorid: donorid,
        lastdonated: lastdonated,
        nextdonation:nextdonation,
   });
   donorreg.saveDonorRegDetails(newdonor,flag);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}


exports.changeDonorRegDetailsAddBBank = async(req,res,next) => {
    console.log("inside controller")
    let donorid = req.body.donorid
    let bb=req.body.bloodbank;

    let result1 =await getdonorreg.getDonorDetails(donorid);

    let transactionstring1 = JSON.parse(result1.toString());
     let t1=transactionstring1.bloodbanks;
     let bb1=t1.concat(",");
     bb1=bb1.concat(bb);
    const newdonor =({
        donorid: donorid,
        bloodbanks: bb1,
   });
   let flag=2;
   donorreg.saveDonorRegDetails(newdonor,flag);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}


function getDonorBankBagDetails(bbid) {
    var id = bbid.split("-");
    var donorbank=id[0]+id[1];

    let result1 =getdonorbank.getDonorBankBagDetails(donorbank);
    let transactionstring1 = JSON.parse(result1.toString());

    console.log(transactionstring1);
    if(transactionstring1.message=="no")
    {
        saveDonorBloodBagDetails(bbid);
        return "newly added"
    }
    else{
     transactionstring1 = JSON.parse(result1.toString());

     let t1=transactionstring1.bloodbags;
     let bb1=t1.concat(",");
     bb1=bb1.concat(bb);
    const newdonor =({
        donorid: donorid,
        bloodbanks: bb1,
   });

   let flag=2;
   donorreg.getDonorBank(newdonor,flag);
   return "success";
    }
}

String.prototype.saveDonorBloodBagDetails = function(bbid) {
    var id = bbid.split("-");
    var donorbank=id[0]+id[1];
    var bagid=id[2];
    
    const newbag =({
        donorbank: donorbank,
        bag: bagid,
    });
   donorbag.saveDonorBloodBagDetails(newbag);
   return "success";
};

exports.changeDonorBankBagDetails = async(req,res,next) => {
    let donorid = req.body.donorid
    let bb=req.body.bloodbank;

    let result1 =await getdonorreg.getDonorDetails(donorid);

    let transactionstring1 = JSON.parse(result1.toString());
     let t1=transactionstring1.bloodbanks;
     let bb1=t1.concat(",");
     bb1=bb1.concat(bb);
    const newdonor =({
        donorid: donorid,
        bloodbanks: bb1,
   });
   let flag=2;
   donorreg.saveDonorRegDetails(newdonor,flag);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.saveDonationDetails = async(req,res,next) => {
    console.log("inside controller")
    const bbid = req.body.bbid;
    console.log("bbid",bbid);
    let todaynow=new Date().toLocaleTimeString();
    console.log("date:",todaynow);
    var transactionstring =JSON.stringify(req.body.donordetails);
    let donorid = req.body.donorid
   let unit = req.body.unit
   let cdate = req.body.collecteddate
   let expirydate=req.body.expirydate
   let bloodgroup=req.body.bloodgroup
   let collectedby=req.body.collectedby
  
   getDonorBankBagDetails(bbid);

    const newdonation =({
       bbid:bbid,
       donorid:donorid,
       transactionstring: transactionstring, 
       bloodgroup:bloodgroup, 
       unit:unit,
       cdate:cdate,
       expirydate:expirydate,  
       collectedby:collectedby,
   });
   network.saveDonationDetails(newdonation);
   
   return res.status(200).json({
    status: 200,
    message: "success",
});

}

exports.saveBloodTestingDetails = async(req,res,next) => {
    const test_id = req.body.test_id;
   // let todaynow=new Date().toLocaleTimeString();
    let tti_flag=req.body.tti_flag;
    let test_date=req.body.test_date;
    var transactionstring =JSON.stringify(req.body.blooddetails);
    var status;
    if(tti_flag="No")
    {
       status = "Tested and Stored";
    } else
    {
        status="Discarded";
    }
    let stored_location= req.body.stored_location;
    let bloodgroup=req.body.bloodgroup
  
    const bloodtesting =({
       test_id:test_id,
       tti_flag:tti_flag,
       test_date:test_date,
       bloodgroup:bloodgroup, 
       status:status,
       stored_location:stored_location,
       transactionstring: transactionstring,
   });
  console.log("bloodtesting",bloodtesting)
   bloodtest.saveBloodTestingDetails(bloodtesting);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.saveBloodTransfusionDetails = async(req,res,next) => {
    console.log("inside controller")
    const trans_id = req.body.trans_id;
   // let todaynow=new Date().toLocaleTimeString();
    let patient_id=req.body.patient_id;
    let blood_type=req.body.blood_type;
    let crossmatch_status=req.body.crossmatch_status;
    var hospital_name =req.body.hospital_name;
    var payment=req.body.payment;
    var trans_status=req.body.trans_status;
    let bloodgroup=req.body.bloodgroup

      const transfusiondetails =({
        trans_id:trans_id,
       blood_type:blood_type,
       bloodgroup:bloodgroup, 
       patient_id:patient_id,
       crossmatch_status:crossmatch_status,
       hospital_name:hospital_name, 
       payment:payment,
       trans_status:trans_status,
   });
  console.log("transfusiondetails",transfusiondetails)
   bloodtrans.saveBloodTransfusionDetails(transfusiondetails);
   return res.status(200).json({
    status: 200,
    message: "success",
});
}

exports.getDonationDetails = async(req,res,next) => {
    let bbid = req.params.bbid
    console.log(bbid)
    let result1 =await getdonor.getDonationDetails(bbid);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}

exports.getDonorDetails = async(req,res,next) => {
    let donorid = req.params.donorid
    console.log(donorid)

    let result1 =await getdonorreg.getDonorDetails(donorid);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}

exports.getBloodTestingDetails = async(req,res,next) => {
    let test_id = req.params.test_id
    let result1 =await getbloodtesting.getBloodTestingDetails(test_id);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}


exports.getBloodTransfusionDetails = async(req,res,next) => {
    let trans_id = req.params.trans_id
    let result1 =await gettransfusion.getBloodTransfusionDetails(trans_id);
 return res.status(200).json({
    status: 200,
    message: "success",result1
});
}

exports.getEntireBloodDetails = async(req,res,next) => {
    let trans_id = req.params.trans_id
    console.log(trans_id)
    var id = trans_id.split("-");
    var donorid=id[0];
    var bankid=id[1];
    var bagid=id[0]+"-"+id[1]+"-"+id[2];
    var testid=bagid+"-"+id[3];

    let result1 =await getdonorreg.getDonorDetails(donorid);
 

    let result2 =await getdonor.getDonationDetails(bagid);

    
    let result3 =await getbloodtesting.getBloodTestingDetails(testid);

   // let result1 =await gettransfusion.getBloodTransfusionDetails(bbid);
 //return res.status(200).json({
   // status: 200,
    //message: "success",result1
//});
}

