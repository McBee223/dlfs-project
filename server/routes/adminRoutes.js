const express = require('express');
const router = express.Router();
const adminNotifController = require('../controllers/adminNotificationController');
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../controllers/adminController');

router.post('/login', adminController.login);
router.post('/add-item', verifyAdmin, adminController.addItem);
router.get('/items', verifyAdmin, adminController.getAllItems);

router.get('/profile', verifyAdmin, adminController.getProfile);
router.put('/profile', verifyAdmin, adminController.updateProfile);

router.get('/users', verifyAdmin, adminController.getAllUsers);
router.get('/admins', verifyAdmin, adminController.getAllAdmins);

router.put('/users/:id', verifyAdmin, adminController.updateUser);
router.put('/admins/:id', verifyAdmin, adminController.updateAdmin);

router.get('/archive', verifyAdmin, adminController.getArchive);
router.post('/archive', verifyAdmin, adminController.moveToArchive);
router.post('/archive/restore/:id', verifyAdmin, adminController.restoreFromArchive);
router.delete('/archive/:id', verifyAdmin, adminController.deleteForever);

router.post('/admins', verifyAdmin, adminController.addAdmin);

router.get('/lost-items', verifyAdmin, adminController.getLostItems);
router.post('/lost-items', verifyAdmin, adminController.addLostItem);
router.put('/lost-items/:id', verifyAdmin, adminController.updateLostItem);
router.delete('/lost-items/:id', verifyAdmin, adminController.deleteLostItem);

router.post('/upload-image', verifyAdmin, upload.single('image'), adminController.uploadImage);

router.get('/claims/approved', verifyAdmin, adminController.getApprovedClaims);
router.get('/claims/rejected', verifyAdmin, adminController.getRejectedClaims);
router.get('/claims/count', verifyAdmin, adminController.getClaimsCount);
router.get('/claims', verifyAdmin, adminController.getClaimItems);
router.put('/claims/:id/return', adminController.markAsReturned);
router.put('/claims/:id/cancel-notif', verifyAdmin, adminController.setCancelNotif);
router.put('/claims/:id', verifyAdmin, adminController.updateClaimStatus);

router.get('/returned-items', verifyAdmin, adminController.getReturnedItems);

router.post('/trash/test', (req, res) => {
    res.json({ message: 'test route hit!' });
});

router.get('/trash', adminController.getTrashItems);
router.post('/trash', adminController.moveToTrash);
router.delete('/trash/:id', adminController.deleteTrashItem);
router.post('/trash/delete-forever', adminController.deleteTrashItemsForever);
router.post('/trash/:id/restore', verifyAdmin, adminController.restoreTrashItem);

router.get('/calendar-events', verifyAdmin, adminController.getCalendarEvents);

router.get('/notifications', verifyAdmin, adminNotifController.getAdminNotifications);
router.put('/notifications/read-all', verifyAdmin, adminNotifController.markAllAdminNotificationsRead);
router.delete('/notifications/delete-all', verifyAdmin, adminNotifController.deleteAllAdminNotifications);
router.put('/notifications/:id/read', verifyAdmin, adminNotifController.markAdminNotificationRead);
router.delete('/notifications/:id', verifyAdmin, adminNotifController.deleteAdminNotification);



router.get('/lost-items/:id', verifyAdmin, adminController.getLostItemById);

module.exports = router;