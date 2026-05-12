const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { createNotification } = require('./NotificationController');
const { createAdminNotification } = require('./adminNotificationController');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
exports.upload = multer({ storage });

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.replace('T', ' ').substring(0, 19);
};

exports.login = (req, res) => {
  const { id, password } = req.body;
  const sql = 'SELECT * FROM admins WHERE id = ? AND password = ?';
  db.query(sql, [id, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Login failed', error: err.message });
    if (results.length === 0) return res.status(401).json({ message: '❌ Admin not found' });
    const admin = results[0];
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({
      message: '✅ Admin login successful!',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        microsoftaccount: admin.microsoftaccount,
        role: admin.role,
        date: admin.date
      }
    });
  });
};

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'lost_items' },
    (error, result) => {
      if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
      res.status(200).json({ url: result.secure_url });
    }
  );
  stream.end(req.file.buffer);
};

exports.addItem = (req, res) => {
  const { name, description, price, stock, date_added } = req.body;
  const added_by = req.user.id;
  const sql = `INSERT INTO items (name, description, price, stock, added_by, date_added) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, description, price, stock, added_by, date_added], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to add item', error: err.message });
    res.status(201).json({ message: '✅ Item added!', itemId: result.insertId });
  });
};

exports.getAllItems = (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch items', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.getProfile = (req, res) => {
  const sql = 'SELECT id, name, microsoftaccount, contact, profile_image, password, date FROM admins WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ user: results[0] });
  });
};

exports.updateProfile = (req, res) => {
  const { name, contact, password, profile_image } = req.body;
  const sql = `UPDATE admins SET 
      name = ?, 
      contact = COALESCE(?, contact), 
      password = COALESCE(?, password),
      profile_image = COALESCE(?, profile_image) 
      WHERE id = ?`;
  db.query(sql, [name, contact || null, password || null, profile_image || null, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update profile', error: err.message });
    res.status(200).json({ message: 'Profile updated successfully!' });
  });
};

exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, microsoftaccount, section, gender, password, date, role FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    res.status(200).json({ users: results });
  });
};

exports.getAllAdmins = (req, res) => {
  const sql = 'SELECT id, name, microsoftaccount, password, date, role FROM admins';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
    res.status(200).json({ admins: results });
  });
};

exports.updateUser = (req, res) => {
  const { name, section, gender, password, microsoftaccount, id: newId } = req.body;
  const { id } = req.params;
  const sql = `UPDATE users SET 
      id = ?,
      name = ?,
      section = ?,
      gender = ?,
      password = ?,
      microsoftaccount = ?
      WHERE id = ?`;
  db.query(sql, [newId || id, name, section, gender, password, microsoftaccount, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update user', error: err.message });
    res.status(200).json({ message: 'User updated successfully!' });
  });
};

exports.updateAdmin = (req, res) => {
  const { name, password, microsoftaccount, id: newId } = req.body;
  const { id } = req.params;
  const finalId = newId || id;
  const sql = `UPDATE admins SET 
      id = ?,
      name = ?,
      password = ?,
      microsoftaccount = ?
      WHERE id = ?`;
  db.query(sql, [finalId, name, password, microsoftaccount, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update admin', error: err.message });
    const newToken = jwt.sign(
      { id: finalId, role: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ message: 'Admin updated successfully!', token: newToken });
  });
};

exports.moveToArchive = (req, res) => {
  const { ids, type } = req.body;
  const sourceTable = type === 'admin' ? 'admins' : 'users';
  const archiveTable = type === 'admin' ? 'admins_archive' : 'users_archive';
  const selectSql = `SELECT * FROM ${sourceTable} WHERE id IN (?)`;
  db.query(selectSql, [ids], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'No records found' });
    let values, insertSql;
    if (type === 'admin') {
      values = results.map(r => [r.id, r.name, r.microsoftaccount, r.password, r.date, r.role]);
      insertSql = `INSERT INTO admins_archive (id, name, microsoftaccount, password, date, role) VALUES ?`;
    } else {
      values = results.map(r => [r.id, r.name, r.microsoftaccount, r.section, r.gender, r.password, r.date, r.role]);
      insertSql = `INSERT INTO users_archive (id, name, microsoftaccount, section, gender, password, date, role) VALUES ?`;
    }
    db.query(insertSql, [values], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to archive', error: err2.message });
      db.query(`DELETE FROM ${sourceTable} WHERE id IN (?)`, [ids], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to delete original', error: err3.message });
        res.status(200).json({ message: 'Moved to archive successfully!' });
      });
    });
  });
};

exports.getArchive = (req, res) => {
  const usersQuery = 'SELECT *, "User" as type FROM users_archive ORDER BY archived_at DESC';
  const adminsQuery = 'SELECT *, "Admin" as type FROM admins_archive ORDER BY archived_at DESC';
  db.query(usersQuery, (err, users) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch user archive', error: err.message });
    db.query(adminsQuery, (err2, admins) => {
      if (err2) return res.status(500).json({ message: 'Failed to fetch admin archive', error: err2.message });
      res.status(200).json({ users, admins });
    });
  });
};

exports.deleteForever = (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  const archiveTable = type === 'admin' ? 'admins_archive' : 'users_archive';
  db.query(`DELETE FROM ${archiveTable} WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
    res.status(200).json({ message: 'Deleted permanently!' });
  });
};

exports.restoreFromArchive = (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  const archiveTable = type === 'admin' ? 'admins_archive' : 'users_archive';
  db.query(`SELECT * FROM ${archiveTable} WHERE id = ?`, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch record', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
    const r = results[0];
    let insertSql, values;
    if (type === 'admin') {
      insertSql = `INSERT INTO admins (id, name, microsoftaccount, password, date, role) VALUES (?, ?, ?, ?, ?, ?)`;
      values = [r.id, r.name, r.microsoftaccount, r.password, r.date, r.role];
    } else {
      insertSql = `INSERT INTO users (id, name, microsoftaccount, section, gender, password, date, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      values = [r.id, r.name, r.microsoftaccount, r.section, r.gender, r.password, r.date, r.role];
    }
    db.query(insertSql, values, (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to restore', error: err2.message });
      db.query(`DELETE FROM ${archiveTable} WHERE id = ?`, [id], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to remove from archive', error: err3.message });
        res.status(200).json({ message: 'Account restored successfully!' });
      });
    });
  });
};

exports.addAdmin = (req, res) => {
  const { id, name, microsoftaccount, password, date, role } = req.body;
  if (!id || !name || !microsoftaccount || !password || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = `INSERT INTO admins (id, name, microsoftaccount, password, date, role) VALUES (?, ?, ?, ?, ?, 'Admin')`;
  db.query(sql, [id, name, microsoftaccount, password, date], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Admin ID or Microsoft account already exists' });
      return res.status(500).json({ message: 'Failed to add admin', error: err.message });
    }
    res.status(201).json({ message: 'Admin added successfully!' });
  });
};

exports.getLostItems = (req, res) => {
  const sql = `
    SELECT 
      id, name, category, status,
      last_seen, image, additional_info,
      DATE_FORMAT(date_found, '%Y-%m-%dT%H:%i') AS date_found
    FROM lost_items 
    ORDER BY date_found DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch lost items', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.addLostItem = (req, res) => {
  const { id, name, category, date_found, last_seen, image, additional_info } = req.body;
  if (!id || !name || !category || !date_found || !last_seen) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = `INSERT INTO lost_items (id, name, category, date_found, last_seen, image, status, additional_info)
                VALUES (?, ?, ?, ?, ?, ?, 'Unclaimed', ?)`;
  db.query(sql, [id, name, category, normalizeDate(date_found), last_seen, image || '', additional_info || null], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Item ID already exists' });
      return res.status(500).json({ message: 'Failed to add item', error: err.message });
    }
    res.status(201).json({ message: '✅ Item added!' });
  });
};

exports.updateLostItem = (req, res) => {
  const { name, category, date_found, last_seen, image, status, additional_info } = req.body;
  const { id } = req.params;
  const sql = `UPDATE lost_items SET name=?, category=?, date_found=?, last_seen=?, image=?, status=?, additional_info=? WHERE id=?`;
  db.query(sql, [name, category, normalizeDate(date_found), last_seen, image, status, additional_info || null, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update item', error: err.message });
    res.status(200).json({ message: 'Item updated!' });
  });
};

exports.deleteLostItem = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM lost_items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete item', error: err.message });
    res.status(200).json({ message: 'Item deleted!' });
  });
};

exports.getClaimItems = (req, res) => {
  const sql = `
    SELECT c.*,
      DATE_FORMAT(c.date_submitted, '%Y-%m-%dT%H:%i') AS date_submitted,
      COALESCE(u.name, 'Unknown User') AS claimant,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category,
      l.last_seen,
      l.image AS item_image,
      l.additional_info,
      DATE_FORMAT(l.date_found, '%Y-%m-%dT%H:%i') AS date_found,
      c.pickup_date,
      c.pickup_time,
      c.image AS claimImage
    FROM claims_items c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.status = 'Pending'
    ORDER BY c.date_submitted DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch claims', error: err.message });
    res.status(200).json({ claims: results });
  });
};

exports.getClaimsCount = (req, res) => {
  const sql = "SELECT COUNT(*) as count FROM claims_items WHERE status = 'Pending'";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch claims count', error: err.message });
    res.status(200).json({ count: results[0].count });
  });
};

exports.updateClaimStatus = (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.query('SELECT user_id FROM claims_items WHERE id = ?', [id], (err0, rows) => {
    if (err0 || rows.length === 0) return res.status(500).json({ message: 'Failed to find claim' });
    const userId = rows[0].user_id;

    const updateSql = status === 'Rejected' && reason
      ? 'UPDATE claims_items SET status = ?, cancel_reason = ? WHERE id = ?'
      : 'UPDATE claims_items SET status = ? WHERE id = ?';
    const updateParams = status === 'Rejected' && reason
      ? [status, reason, id]
      : [status, id];

    db.query(updateSql, updateParams, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update claim', error: err.message });

      if (status === 'Approved') createNotification(userId, 'Approved');
      if (status === 'Rejected') createNotification(userId, 'Rejected');

      const message = status === 'Approved'
        ? 'Your claim has been approved by the admin.'
        : status === 'Rejected'
          ? reason
            ? `Your claim was rejected. Reason: ${reason}`
            : 'Your claim request has been rejected by the admin.'
          : 'Your claim request is pending review.';

      db.query(
        'UPDATE user_item_status SET status = ?, message = ? WHERE claim_id = ?',
        [status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Rejected' : 'Pending', message, id],
        (err2) => {
          if (err2) console.error('Failed to update user item status:', err2.message);
          res.status(200).json({ message: `Claim ${status}!` });
        }
      );
    });
  });
};

exports.getApprovedClaims = (req, res) => {
  const sql = `
    SELECT 
      c.id, c.user_id, c.lost_item_id, c.status, c.date_submitted,
      COALESCE(u.name, 'Unknown User') AS claimant,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category,
      l.last_seen,
      l.image AS item_image,
      l.additional_info,
      DATE_FORMAT(l.date_found, '%Y-%m-%dT%H:%i') AS date_found,
      DATE_FORMAT(c.date_submitted, '%Y-%m-%dT%H:%i') AS date_approved_raw,
      DATE_FORMAT(c.date_submitted, '%m-%d-%Y') AS date_approved
    FROM claims_items c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.status = 'Approved'
    ORDER BY c.date_submitted DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch approved claims', error: err.message });
    res.status(200).json({ claims: results });
  });
};

exports.getRejectedClaims = (req, res) => {
  const sql = `
    SELECT 
      c.id, c.user_id, c.lost_item_id, c.status, c.date_submitted,
      COALESCE(u.name, 'Unknown User') AS claimant,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category,
      l.last_seen,
      l.image AS item_image,
      l.additional_info,
      DATE_FORMAT(l.date_found, '%Y-%m-%dT%H:%i') AS date_found,
      DATE_FORMAT(c.date_submitted, '%Y-%m-%dT%H:%i') AS date_rejected_raw,
      DATE_FORMAT(c.date_submitted, '%m-%d-%Y') AS date_rejected
    FROM claims_items c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.status = 'Rejected'
    ORDER BY c.date_submitted DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch rejected claims', error: err.message });
    res.status(200).json({ claims: results });
  });
};

exports.markAsReturned = (req, res) => {
  const { id } = req.params;

  const getSql = `
    SELECT c.*, 
      COALESCE(u.name, 'Unknown User') AS claimant,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category,
      l.last_seen,
      l.image AS item_image,
      l.additional_info,
      DATE_FORMAT(l.date_found, '%Y-%m-%dT%H:%i') AS date_found
    FROM claims_items c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.id = ?
  `;
  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch claim', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Claim not found' });

    const claim = results[0];

    const insertSql = `
      INSERT INTO returned_items 
        (claim_id, lost_item_id, user_id, claimant, item_name, category, last_seen, image, additional_info, date_found)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [
      claim.id, claim.lost_item_id, claim.user_id, claim.claimant,
      claim.item_name, claim.category,
      claim.last_seen || null,
      claim.item_image || null,
      claim.additional_info || null,
      claim.date_found || null
    ], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to insert returned item', error: err2.message });

      db.query('UPDATE claims_items SET status = ? WHERE id = ?', ['Returned', id], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to update claim status', error: err3.message });

        db.query('UPDATE lost_items SET status = ? WHERE id = ?', ['Returned', claim.lost_item_id], (err4) => {
          if (err4) return res.status(500).json({ message: 'Failed to update lost item status', error: err4.message });

          createNotification(claim.user_id, 'Returned');

          db.query(
            `UPDATE user_item_status SET status = 'Returned', message = 'Your item has been returned successfully.' WHERE claim_id = ?`,
            [id],
            (err5) => {
              if (err5) console.error('Failed to update user item status:', err5.message);
              res.status(200).json({ message: 'Item marked as returned!' });
            }
          );
        });
      });
    });
  });
};

exports.getReturnedItems = (req, res) => {
  const sql = `
    SELECT 
      r.id, r.claim_id, r.lost_item_id, r.user_id, r.claimant, r.item_name,
      r.category, r.last_seen, r.image, r.additional_info,
      DATE_FORMAT(r.date_found, '%Y-%m-%dT%H:%i') AS date_found,
      DATE_FORMAT(r.returned_at, '%Y-%m-%dT%H:%i') AS date_returned_raw,
      DATE_FORMAT(r.returned_at, '%m-%d-%Y') AS date_returned
    FROM returned_items r
    ORDER BY r.returned_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch returned items', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.restoreTrashItem = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM trash_items WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch trash item', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Trash item not found' });

    const item = results[0];
    const {
      source_tab, claimant, item_number, item_name, status,
      original_id, user_id, lost_item_id, category,
      date_found, last_seen, image, additional_info
    } = item;

    if (source_tab === 'cancelled') {
      return res.status(400).json({ message: 'Cancelled items cannot be restored.' });
    }

    const deleteFromTrash = (cb) => {
      db.query('DELETE FROM trash_items WHERE id = ?', [id], cb);
    };

    if (source_tab === 'lost') {
      const itemId = item_number?.replace(/^#/, '').trim();

      db.query('SELECT id FROM lost_items WHERE id = ?', [itemId], (err2, existing) => {
        if (err2) return res.status(500).json({ message: 'DB error checking lost_items', error: err2.message });
        if (existing.length > 0) return res.status(409).json({ message: 'Item already exists in lost items' });

        db.query(
          `INSERT INTO lost_items (id, name, category, status, date_found, last_seen, image, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [itemId, item_name, category || null, status || 'Unclaimed', date_found || null, last_seen || null, image || null, additional_info || null],
          (err3) => {
            if (err3) return res.status(500).json({ message: 'Failed to restore lost item', error: err3.message });
            deleteFromTrash((err4) => {
              if (err4) return res.status(500).json({ message: 'Restored but failed to remove from trash', error: err4.message });
              res.status(200).json({ message: 'Lost item restored!' });
            });
          }
        );
      });

    } else if (['claim', 'approved', 'rejected'].includes(source_tab)) {
      const restoreStatus = source_tab === 'approved' ? 'Approved'
        : source_tab === 'rejected' ? 'Rejected'
          : 'Pending';

      db.query(
        `INSERT INTO claims_items (id, user_id, lost_item_id, status, date_submitted)
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [original_id, user_id, String(lost_item_id).padStart(4, '0'), restoreStatus],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Failed to restore claim', error: err2.message });
          deleteFromTrash((err3) => {
            if (err3) return res.status(500).json({ message: 'Restored but failed to remove from trash', error: err3.message });
            res.status(200).json({ message: `Claim restored to ${source_tab}!` });
          });
        }
      );

    } else if (source_tab === 'returned') {
      db.query(
        `INSERT INTO returned_items 
          (claim_id, lost_item_id, user_id, claimant, item_name, category, last_seen, image, additional_info, date_found)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE item_name = VALUES(item_name)`,
        [
          original_id, lost_item_id || null, user_id || null,
          claimant, item_name, category || null,
          last_seen || null, image || null,
          additional_info || null, date_found || null
        ],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Failed to restore returned item', error: err2.message });
          deleteFromTrash((err3) => {
            if (err3) return res.status(500).json({ message: 'Restored but failed to remove from trash', error: err3.message });
            res.status(200).json({ message: 'Returned item restored!' });
          });
        }
      );

    } else {
      return res.status(400).json({ message: `Unknown source_tab: ${source_tab}` });
    }
  });
};

exports.getReturnedItems = (req, res) => {
  const sql = `
    SELECT 
      r.id, r.claim_id, r.lost_item_id, r.user_id, r.claimant, r.item_name,
      r.category, r.last_seen, r.image, r.additional_info,
      DATE_FORMAT(r.date_found, '%Y-%m-%dT%H:%i') AS date_found,
      DATE_FORMAT(r.returned_at, '%Y-%m-%dT%H:%i') AS date_returned_raw,
      DATE_FORMAT(r.returned_at, '%m-%d-%Y') AS date_returned
    FROM returned_items r
    ORDER BY r.returned_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch returned items', error: err.message });
    res.status(200).json({ items: results });
  });
};



exports.moveToTrash = (req, res) => {
  const {
    source_tab, claim_id, claimant, item_number, item_name,
    status, original_id, user_id, lost_item_id, category,
    date_found, last_seen, image, additional_info
  } = req.body;
  console.log('moveToTrash HIT, source_tab:', source_tab);
  db.query(
    `INSERT INTO trash_items 
      (source_tab, claim_id, claimant, item_number, item_name, status, 
       original_id, user_id, lost_item_id, category, date_found, last_seen, image, additional_info) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      source_tab, claim_id, claimant, item_number, item_name, status,
      original_id || null, user_id || null,
      lost_item_id ? String(lost_item_id).padStart(4, '0') : null,
      category || null,
      date_found || null,
      last_seen || null,
      image || null,
      additional_info || null
    ],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to move to trash', error: err.message });

      if (source_tab === 'lost') {
        const itemId = item_number?.replace(/^#/, '').trim();
        db.query('DELETE FROM lost_items WHERE id = ?', [itemId], (err2) => {
          if (err2) return res.status(500).json({ message: 'Trashed but failed to delete from lost_items', error: err2.message });
          res.status(201).json({ message: 'Moved to trash!' });
        });
      } else if (['claim', 'approved', 'rejected'].includes(source_tab)) {
        db.query('DELETE FROM claims_items WHERE id = ?', [original_id], (err2) => {
          if (err2) return res.status(500).json({ message: 'Trashed but failed to delete claim', error: err2.message });
          res.status(201).json({ message: 'Moved to trash!' });
        });
      } else if (source_tab === 'returned') {
        db.query('DELETE FROM returned_items WHERE claim_id = ?', [original_id], (err2) => {
          if (err2) return res.status(500).json({ message: 'Trashed but failed to delete returned item', error: err2.message });
          res.status(201).json({ message: 'Moved to trash!' });
        });
      } else if (source_tab === 'cancelled') {
        console.log('cancelled branch hit, original_id:', original_id);
        if (user_id) createNotification(user_id, 'Cancelled');
        db.query(
          'UPDATE claims_items SET status = ?, pickup_date = NULL, pickup_time = NULL WHERE id = ?',
          ['Pending', original_id],
          (err2, result) => {
            console.log('UPDATE result:', result?.affectedRows, err2?.message);
            if (err2) return res.status(500).json({ message: 'Moved to trash but failed to update claim', error: err2.message });
            db.query(
              `UPDATE user_item_status SET status = 'In Process', message = 'Your re-claim is currently under review.' WHERE claim_id = ?`,
              [original_id],
              (err3) => {
                if (err3) console.error('Failed to update user item status:', err3.message);
                res.status(201).json({ message: 'Moved to trash as cancelled!' });
              }
            );
          }
        );
      } else {
        res.status(201).json({ message: 'Moved to trash!' });
      }
    }
  );
};

exports.getTrashItems = (req, res) => {
  const sql = `
    SELECT *, DATE_FORMAT(date_deleted, '%m-%d-%Y') AS dateDeleted 
    FROM trash_items 
    ORDER BY date_deleted DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch trash', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.deleteTrashItem = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM trash_items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
    res.status(200).json({ message: 'Deleted forever!' });
  });
};

exports.deleteTrashItemsForever = (req, res) => {
  const { ids } = req.body;
  db.query('DELETE FROM trash_items WHERE id IN (?)', [ids], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
    res.status(200).json({ message: 'Deleted forever!' });
  });
};

exports.getCalendarEvents = (req, res) => {
  const sql = `
    SELECT 
      c.id, c.pickup_date, c.pickup_time,
      COALESCE(u.name, 'Unknown User') AS claimant,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category
    FROM claims_items c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.status = 'Approved' AND c.pickup_date IS NOT NULL
    ORDER BY c.pickup_date ASC, c.pickup_time ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch calendar events', error: err.message });
    res.status(200).json({ events: results });
  });
};

exports.setCancelNotif = (req, res) => {
  const { id } = req.params;
  const { reason, suggestedTime } = req.body;
  console.log('setCancelNotif id:', id);

  db.query(
    `UPDATE claims_items SET has_cancel_notif = 1, cancel_reason = ?, cancel_suggested_time = ? WHERE id = ?`,
    [reason || null, suggestedTime || null, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to set cancel notif', error: err.message });

      // ✅ Add these: reset claim status and update user item status
      db.query(
        `UPDATE claims_items SET status = 'Pending', pickup_date = NULL, pickup_time = NULL WHERE id = ?`,
        [id],
        (err2) => {
          if (err2) console.error('Failed to reset claim status:', err2.message);

          db.query(
            `UPDATE user_item_status SET status = 'In Process', message = 'Your re-claim is currently under review.' WHERE claim_id = ?`,
            [id],
            (err3) => {
              if (err3) console.error('Failed to update user item status:', err3.message);
              res.json({ message: 'Cancel notif updated' });
            }
          );
        }
      );
    }
  );
};
exports.getLostItemById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT *, DATE_FORMAT(date_found, '%Y-%m-%dT%H:%i') AS date_found FROM lost_items WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch item', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ item: results[0] });
  });
};
