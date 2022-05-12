/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
       
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async createDonorRegDetails(ctx, donorid,lastdonated,bloodbanks,donorstring) {
        console.info('============= START : Create Donation Details ===========');

       let donorstring1 = JSON.parse(donorstring.toString());

        let flag=true
        if(flag)
        {
           const donordetail = {
               lastdonated:lastdonated,
               bloodbanks:bloodbanks,
               donorname:donorstring1.donorname,
               email:donorstring1.email,
               phone:donorstring1.phone,
               dob:donorstring1.dob,
               gender:donorstring1.gender,
               bloodgroup:donorstring1.bloodgroup,
               willingflag:donorstring1.willingflag,
               selffitflag:donorstring1.selffitflag,
               city:donorstring1.city,
               weight:donorstring1.weight,
           };
        await ctx.stub.putState(donorid, Buffer.from(JSON.stringify(donordetail)));
        console.info('============= END : Create Donor Details ===========');
        }
        else
        {
            throw new Error(`Cannot store the details`);
        }
    }

    async saveDonorBloodBagDetails(ctx, donorbank,donorbag) {
        console.info('============= START : Create Donor-Bank Bag Details ===========');


        let flag=true
        if(flag)
        {
           const donordetail = {
            bloodbags:donorbag,
           };
        await ctx.stub.putState(donorbank, Buffer.from(JSON.stringify(donordetail)));
        console.info('============= END : Create Donor-Bank Bag Details ===========');
        }
        else
        {
            throw new Error(`Cannot store the details`);
        }
    }
    
    async createDonationDetails(ctx,bbid,donorid,transactionstring,bloodgroup,unit,cdate,edate,collectedby) {
        console.info('============= START : Create Donation Details ===========');
        let flag=true
        let todaynow=new Date().toLocaleTimeString();
       let transactionstring1 = JSON.parse(transactionstring.toString());
       let hg = parseFloat(transactionstring1.hg)
        let temp=parseFloat(transactionstring1.temp)
        let bps=parseInt(transactionstring1.bps)
        let bpd=parseInt(transactionstring1.bpd)
        let pulse=parseInt(transactionstring1.pulse)
        let hist_verified=transactionstring1.historyverified
        if(hg<12.5)
        {
        flag=false
        }
        if(temp>99)
        {
        flag=false
        }
        if(bps>160 || bpd>100)
        {
        flag=false
        }
        if(pulse>100 || pulse<60)
        {
        flag=false
        }
        if(hist_verified != 'yes')
        {
        flag=false
        }
        console.log("flag",flag);
        if(flag)
        {
            const donorcollection = {
                donorid:donorid,
                donordetails: transactionstring,
                bloodgroup: bloodgroup,
                unit:unit,
                collecteddate:cdate,
                expirydate:edate,
                collectedby:collectedby,
            };
        await ctx.stub.putState(bbid, Buffer.from(JSON.stringify(donorcollection)));
        console.info('============= END : Create Donation Details ===========');
        }
        else
        {
            throw new Error(`Cannot store the details`);
        }
    }

    async createBloodTestingDetails(ctx,test_id,tti_flag,test_date,bloodgroup,status,stored_location,transactionstring) {
        console.info('============= START : Create Blood Testing Details ===========');
        let flag=true

        console.log("flag",flag);
        if(flag)
        {
            const bloodtesting = {
                tti_flag:tti_flag,
                test_date: test_date,
                bloodgroup: bloodgroup,
                status:status,
                stored_location:stored_location,
                transactionstring:transactionstring,
            };
        await ctx.stub.putState(test_id, Buffer.from(JSON.stringify(bloodtesting)));
        console.info('============= END : Create Blood Testing Details ===========');
        }
        else
        {
            throw new Error(`Cannot store the details`);
        }
    }

    async createBloodTransfusionDetails(ctx,trans_id,blood_type,bloodgroup,patient_id,crossmatch_status,hospital_name,payment,trans_status) {
             console.info('============= START : Create Transfusion Details ===========');

             let flag=true
             if(flag)
             {
                const transfusiondetails = {
                blood_type:blood_type, 
                bloodgroup: bloodgroup,
                patient_id:patient_id,
                crossmatch_status:crossmatch_status,
                hospital_name:hospital_name,
                payment:payment,
                trans_status:trans_status,
                };
             await ctx.stub.putState(trans_id, Buffer.from(JSON.stringify(transfusiondetails)));
             console.info('============= END : Create Transfusion Details ===========');
             }
             else
             {
                 throw new Error(`Cannot store the details`);
             }
         }

    async queryDonationDetails(ctx, bbid) {
        const donationBytes = await ctx.stub.getState(bbid); // get the car from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${bbid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryDonorBank(ctx, donorbank) {
        const donationBytes = await ctx.stub.getState(donorbank); // get the car from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            donationBytes= {
                message:"no",
               };

        } else
        {
        console.log(donationBytes.toString());
        return donationBytes.toString();
        }
    }

    async queryBloodTesting(ctx, bbid) {
        const donationBytes = await ctx.stub.getState(bbid); // get the car from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${bbid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryTransfusion(ctx, bbid) {
        const donationBytes = await ctx.stub.getState(bbid); // get the car from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${bbid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryDonorRegDetails(ctx, donorid) {
        const donationBytes = await ctx.stub.getState(donorid); // get the donor from chaincode state
        if (!donationBytes || donationBytes.length === 0) {
            throw new Error(`${donorid} does not exist`);
        }
        console.log(donationBytes.toString());
        return donationBytes.toString();
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeLastDonatedDate(ctx, donorid, donateddate,nextdate) {
        console.info('============= START : ChangeLastDonatedDate ===========');

        const donorAsBytes = await ctx.stub.getState(donorid); // get the donor from chaincode state
        if (!donorAsBytes || donorAsBytes.length === 0) {
            throw new Error(`${donorid} does not exist`);
        }
        const donor = JSON.parse(donorAsBytes.toString());
        donor.lastdonated = donateddate;
        donor.nextdonation = nextdate;

        await ctx.stub.putState(donorid, Buffer.from(JSON.stringify(donor)));
        console.info('============= END : ChangeLastDonatedDate ===========');
    }

    async changeDonorBloodBankList(ctx, donorid, bb) {
        console.info('============= START : ChangeLastDonatedDate ===========');

        const donorAsBytes = await ctx.stub.getState(donorid); // get the car from chaincode state
        if (!donorAsBytes || donorAsBytes.length === 0) {
            throw new Error(`${donorid} does not exist`);
        }
        const donor = JSON.parse(donorAsBytes.toString());
        donor.bloodbanks = bb;

        await ctx.stub.putState(donorid, Buffer.from(JSON.stringify(donor)));
        console.info('============= END : ChangeLastDonatedDate ===========');
    }
    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
