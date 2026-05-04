const db = require('../config/db');

exports.getAdminNotifications = (req, res) => {
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
        FROM admin_notifications
        ORDER BY created_at DESC
        LIMIT 50
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch', error: err.message });
        res.status(200).json({ notifications: results });
    });
};

exports.deleteAdminNotification = (req, res) => {
    db.query(
        'DELETE FROM admin_notifications WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
            res.status(200).json({ message: 'Deleted!' });
        }
    );
};

exports.markAdminNotificationRead = (req, res) => {
    db.query(
        'UPDATE admin_notifications SET `read` = 1 WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update', error: err.message });
            res.status(200).json({ message: 'Marked as read!' });
        }
    );
};

exports.markAllAdminNotificationsRead = (req, res) => {
    db.query(
        'UPDATE admin_notifications SET `read` = 1',
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update', error: err.message });
            res.status(200).json({ message: 'All marked as read!' });
        }
    );
};

exports.createAdminNotification = (title, text) => {
    db.query(
        'INSERT INTO admin_notifications (title, text) VALUES (?, ?)',
        [title, text],
        (err) => { if (err) console.error('Failed to create admin notif:', err.message); }
    );
};

exports.deleteAllAdminNotifications = (req, res) => {
    db.query('DELETE FROM admin_notifications', (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete all', error: err.message });
        res.status(200).json({ message: 'All admin notifications deleted!' });
    });
};