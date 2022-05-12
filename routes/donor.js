const express = require('express')
const router = express.Router()
const DonorController = require('../controllers/DonorController')

// router.get('/viewdonor',DonorController.viewDonor)
// router.post('/show',DonorController.show)
// router.post('/store',DonorController.store)
// router.post('/update',DonorController.update)
// router.post('/delete',DonorController.destroy)
// console.log('hi')
router.post('/createDonorRegEntry',DonorController.saveDonorRegDetails)
router.post('/changeDonorRegEntry',DonorController.changeDonorRegDetails)
router.post('/addBBankToDonorRegEntry',DonorController.changeDonorRegDetailsAddBBank)
router.get('/getDonorDetails/:donorid',DonorController.getDonorDetails)
router.get('/getEntireBloodDetails/:trans_id',DonorController.getEntireBloodDetails)

router.post('/createDonationEntry',DonorController.saveDonationDetails)
router.get('/getDonationDetails/:bbid',DonorController.getDonationDetails)

router.post('/createTestingEntry',DonorController.saveBloodTestingDetails)
router.get('/getBloodTestingDetails/:test_id',DonorController.getBloodTestingDetails)

router.post('/createTransfusionEntry',DonorController.saveBloodTransfusionDetails)
router.get('/getTransfusionDetails/:trans_id',DonorController.getBloodTransfusionDetails)


module.exports = router