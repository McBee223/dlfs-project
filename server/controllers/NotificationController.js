const db = require('../config/db');

const NOTIF_TEMPLATES = {
    Pending: {
        title: 'Claim Submitted',
        text: 'Your claim has been successfully submitted and is currently under review.',
    },
    Approved: {
        title: 'Claim Approved',
        text: 'Your claim has been approved. Please check your schedule to see when you can claim your item.',
    },
    Rejected: {
        title: 'Claim Rejected',
        text: 'Your claim has been rejected. Please review your submission and try again.',
    },
    Cancelled: {
        title: 'Claim Cancelled',
        text: 'Your approved claim has been cancelled. This may be due to an issue with item verification. Please contact the administrator or submit a new request.',
    },
    Returned: {
        title: 'Item Returned Successfully',
        text: 'Your item has been successfully claimed and marked as returned. Thank you!',
    },
    ScheduleSubmitted: {
        title: 'Schedule Submitted',
        text: 'Your preferred pickup schedule has been submitted and is awaiting admin confirmation.',
    },
};

const createNotification = (userId, type) => {
    const tmpl = NOTIF_TEMPLATES[type];
    if (!tmpl || !userId) return;
    db.query(
        'INSERT INTO notifications (user_id, title, text) VALUES (?, ?, ?)',
        [userId, tmpl.title, tmpl.text],
        (err) => { if (err) console.error('Failed to create notification:', err.message); }
    );
};

exports.createNotification = createNotification;

exports.getNotifications = (req, res) => {
    const sql = `
        SELECT 
            id, title, text, \`read\`,
            CASE
                WHEN TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 1 THEN 'Just now'
                WHEN TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' hours ago')
                WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 48 THEN 'Yesterday'
                ELSE CONCAT(TIMESTAMPDIFF(DAY, created_at, NOW()), ' days ago')
            END AS time
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    `;
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
        res.status(200).json({ notifications: results });
    });
};

exports.deleteNotification = (req, res) => {
    db.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
            res.status(200).json({ message: 'Deleted!' });
        }
    );
};

exports.markNotificationRead = (req, res) => {
    db.query(
        'UPDATE notifications SET `read` = 1 WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update', error: err.message });
            res.status(200).json({ message: 'Marked as read!' });
        }
    );
};

exports.markAllNotificationsRead = (req, res) => {
    db.query(
        'UPDATE notifications SET `read` = 1 WHERE user_id = ?',
        [req.user.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update', error: err.message });
            res.status(200).json({ message: 'All marked as read!' });
        }
    );
};

exports.deleteAllNotifications = (req, res) => {
    const userId = req.user.id;
    db.query('DELETE FROM notifications WHERE user_id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete all notifications', error: err.message });
        res.status(200).json({ message: 'All notifications deleted!' });
    });
};
