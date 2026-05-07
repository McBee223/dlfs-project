const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { createNotification } = require('./NotificationController');
const { createAdminNotification } = require('./adminNotificationController');

exports.signup = (req, res) => {
  console.log("SIGNUP BODY:", req.body);
  const { id, name, microsoftaccount, gender, password, date, role } = req.body;

  if (!id || !name || !microsoftaccount || !gender || !password || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO users (id, name, microsoftaccount, section, gender, password, date, role)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [id, name, microsoftaccount, req.body.section || null, gender, password, date, role || 'User'], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'ID or account already exists' });
      }
      return res.status(500).json({ message: 'Signup failed', error: err.message });
    }
    createAdminNotification('New User Logged In', `A new user has registered: ${name}`);
    res.status(201).json({ message: '✅ User created successfully!' });
  });
};

exports.login = (req, res) => {
  const { microsoftaccount, password, role } = req.body;

  if (!microsoftaccount || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'SELECT * FROM users WHERE microsoftaccount = ? AND password = ?';

  db.query(sql, [microsoftaccount, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Login failed', error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid account or password' });

    const user = results[0];

    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Incorrect role. Please select the right account type.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: '✅ Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        microsoftaccount: user.microsoftaccount,
        section: user.section,
        gender: user.gender,
        role: user.role,
        date: user.date
      }
    });
  });
};

exports.getItems = (req, res) => {
  const sql = 'SELECT * FROM items';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch items', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.getLostItems = (req, res) => {
  const sql = `
    SELECT l.*,
      my_claim.id AS user_claim_id,
      my_claim.status AS claim_status,
      my_claim.has_cancel_notif,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'claim_id', c2.id,
            'user_id', c2.user_id,
            'name', u2.name,
            'approved_at', c2.date_submitted,
            'pickup_date', c2.pickup_date,
            'pickup_time', c2.pickup_time
          )
        )
        FROM claims_items c2
        LEFT JOIN users u2 ON u2.id = c2.user_id
        WHERE c2.lost_item_id = l.id AND c2.status = 'Approved'
      ) AS approved_claims,
      ret.returned_at AS returned_at,
      ret_user.name AS returned_by_name
    FROM lost_items l
    LEFT JOIN claims_items my_claim
  ON my_claim.id = (
    SELECT id FROM claims_items
    WHERE lost_item_id = l.id
      AND user_id = ?
      AND status != 'Trashed'
    ORDER BY id DESC LIMIT 1
  )
    LEFT JOIN returned_items ret ON ret.lost_item_id = l.id
    LEFT JOIN users ret_user ON ret_user.id = ret.user_id
    WHERE l.status IN ('Unclaimed', 'Returned', 'Claimed')
    ORDER BY l.date_found DESC
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch lost items', error: err.message });
    const parsed = results.map(row => ({
      ...row,
      approved_claims: row.approved_claims
        ? (typeof row.approved_claims === 'string' ? JSON.parse(row.approved_claims) : row.approved_claims)
        : []
    }));
    res.status(200).json({ items: parsed });
  });
};

exports.updateClaim = (req, res) => {
  const { id } = req.params;
  const { brand, last_seen, date_lost, item_condition, description, color, image, pickup_date, pickup_time } = req.body;

  const sql = `
    UPDATE claims_items SET
      brand = ?, last_seen = ?, date_lost = ?, item_condition = ?,
      description = ?, color = ?, image = COALESCE(?, image),
      pickup_date = ?, pickup_time = ?
    WHERE id = ? AND user_id = ? AND status = 'Pending'
  `;
  db.query(sql, [brand, last_seen, date_lost, item_condition, description, color, image || null, pickup_date, pickup_time, id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update claim', error: err.message });
    if (result.affectedRows === 0) return res.status(403).json({ message: 'Claim not found or not editable' });
    if (pickup_date && pickup_time) {
      createAdminNotification('Schedule Submitted by User', 'A user has selected a preferred pickup schedule.');
    }
    res.status(200).json({ message: 'Claim updated!' });
  });
};

exports.getClaimById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM claims_items WHERE id = ? AND user_id = ?`;
  db.query(sql, [id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch claim', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Claim not found' });
    res.status(200).json({ claim: results[0] });
  });
};

exports.getProfile = (req, res) => {
  const sql = 'SELECT id, name, microsoftaccount, section, gender, contact, profile_image, date FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: results[0] });
  });
};

exports.updateProfile = (req, res) => {
  const { name, gender, contact, profile_image } = req.body;

  const sql = `UPDATE users SET 
    name = ?,
    gender = COALESCE(?, gender),
    contact = COALESCE(?, contact),
    profile_image = COALESCE(?, profile_image)
    WHERE id = ?`;

  db.query(sql, [name, gender || null, contact || null, profile_image || null, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update profile', error: err.message });
    res.status(200).json({ message: 'Profile updated successfully!' });
  });
};

exports.getPinnedItems = (req, res) => {
  const sql = `
    SELECT l.*,
      c.id AS user_claim_id,
      c.status AS claim_status,
      c.has_cancel_notif,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'claim_id', c2.id,
            'user_id', c2.user_id,
            'name', u2.name,
            'approved_at', c2.date_submitted,
            'pickup_date', c2.pickup_date,
            'pickup_time', c2.pickup_time
          )
        )
        FROM claims_items c2
        LEFT JOIN users u2 ON u2.id = c2.user_id
        WHERE c2.lost_item_id = l.id AND c2.status = 'Approved'
      ) AS approved_claims,
      ret.returned_at AS returned_at,
      ret_user.name AS returned_by_name
    FROM lost_items l
    INNER JOIN pinned_items p ON l.id = p.lost_item_id
    LEFT JOIN claims_items c 
      ON c.id = (
        SELECT id FROM claims_items 
        WHERE lost_item_id = l.id AND user_id = ? AND status != 'Trashed'
        ORDER BY id DESC LIMIT 1
      )
    LEFT JOIN returned_items ret ON ret.lost_item_id = l.id
    LEFT JOIN users ret_user ON ret_user.id = ret.user_id
    WHERE p.user_id = ?
    ORDER BY p.pinned_at DESC
  `;
  db.query(sql, [req.user.id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch pinned items', error: err.message });
    const parsed = results.map(row => ({
      ...row,
      approved_claims: row.approved_claims
        ? (typeof row.approved_claims === 'string' ? JSON.parse(row.approved_claims) : row.approved_claims)
        : []
    }));
    res.status(200).json({ items: parsed });
  });
};

exports.pinItem = (req, res) => {
  const { lost_item_id } = req.body;
  if (!lost_item_id) return res.status(400).json({ message: 'lost_item_id is required' });

  const sql = 'INSERT INTO pinned_items (user_id, lost_item_id) VALUES (?, ?)';
  db.query(sql, [req.user.id, lost_item_id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Item already pinned' });
      return res.status(500).json({ message: 'Failed to pin item', error: err.message });
    }
    res.status(201).json({ message: 'Item pinned!' });
  });
};

exports.unpinItem = (req, res) => {
  const { lost_item_id } = req.params;
  const sql = 'DELETE FROM pinned_items WHERE user_id = ? AND lost_item_id = ?';
  db.query(sql, [req.user.id, lost_item_id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to unpin item', error: err.message });
    res.status(200).json({ message: 'Item unpinned!' });
  });
};

exports.submitClaim = (req, res) => {
  const { lost_item_id, brand, last_seen, date_lost, item_condition,
    description, color, image, pickup_date, pickup_time } = req.body;

  if (!lost_item_id || !brand || !last_seen || !date_lost || !item_condition || !pickup_date || !pickup_time) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const checkPending = `SELECT id FROM claims_items WHERE user_id = ? AND lost_item_id = ? AND status = 'Pending'`;
  db.query(checkPending, [req.user.id, lost_item_id], (err, pending) => {
    if (err) return res.status(500).json({ message: 'Failed to check existing claim', error: err.message });
    if (pending.length > 0) return res.status(400).json({ message: 'You already have a pending claim for this item.' });

    const normalizedDate = date_lost.replace('T', ' ').substring(0, 19);

    const checkRejected = `SELECT id FROM claims_items WHERE user_id = ? AND lost_item_id = ? AND status = 'Rejected' LIMIT 1`;
    db.query(checkRejected, [req.user.id, lost_item_id], (err2, rejected) => {
      if (err2) return res.status(500).json({ message: 'Failed to check rejected claim', error: err2.message });

      const claimSql = `INSERT INTO claims_items (user_id, lost_item_id, brand, last_seen, date_lost, item_condition, description, color, image, pickup_date, pickup_time)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(claimSql, [req.user.id, lost_item_id, brand, last_seen, normalizedDate, item_condition, description || null, color || null, image || null, pickup_date, pickup_time], (err3, result) => {
        if (err3) return res.status(500).json({ message: 'Failed to submit claim', error: err3.message });

        const claimId = result.insertId;

        // Notify user + admin
        createNotification(req.user.id, 'Pending');
        createAdminNotification('Claim Submitted by User', 'A user has submitted a new claim request.');

        const itemSql = `SELECT name, category FROM lost_items WHERE id = ?`;
        db.query(itemSql, [lost_item_id], (err4, items) => {
          if (err4 || items.length === 0) return res.status(201).json({ message: 'Claim submitted!' });

          const lostItem = items[0];
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const message = rejected.length > 0
            ? `Your re-claim for ${lostItem.name} is currently under review.`
            : `Your claim for ${lostItem.name} is currently under review.`;

          if (rejected.length > 0) {
            db.query(
              `UPDATE user_item_status SET status = 'In Process', message = ?, claim_id = ?, date_submitted = ? WHERE user_id = ? AND lost_item_id = ? AND status = 'Rejected'`,
              [message, claimId, dateStr, req.user.id, lost_item_id],
              (err5) => {
                if (err5) console.error("Status update error:", err5.message);
                res.status(201).json({ message: 'Claim resubmitted!' });
              }
            );
          } else {
            db.query(
              `INSERT INTO user_item_status (user_id, lost_item_id, claim_id, item_name, category, status, message, date_submitted) VALUES (?, ?, ?, ?, ?, 'In Process', ?, ?)`,
              [req.user.id, lost_item_id, claimId, lostItem.name, lostItem.category, message, dateStr],
              (err5) => {
                if (err5) console.error("Status insert error:", err5.message);
                res.status(201).json({ message: 'Claim submitted!' });
              }
            );
          }
        });
      });
    });
  });
};

exports.getItemStatus = (req, res) => {
  const sql = `
    SELECT u.*, u.claim_id, u.lost_item_id, l.image, l.last_seen
    FROM user_item_status u
    LEFT JOIN lost_items l ON u.lost_item_id = l.id
    WHERE u.user_id = ?
    ORDER BY u.id DESC
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch item status', error: err.message });
    res.status(200).json({ items: results });
  });
};

exports.moveToUserTrash = (req, res) => {
  const { item_status_id, lost_item_id, claim_id, item_name, category, status, message, date_submitted } = req.body;
  const userId = req.user.id;

  const statusToStore = status === 'In Process' ? 'Pending' : status;

  db.query(
    `SELECT id FROM user_trash_items WHERE item_status_id = ? AND user_id = ?`,
    [item_status_id, userId],
    (checkErr, existing) => {
      if (checkErr) return res.status(500).json({ message: 'Failed to check trash', error: checkErr.message });
      if (existing.length > 0) return res.status(200).json({ message: 'Already in trash' });

      db.query(
        `INSERT INTO user_trash_items (user_id, item_status_id, lost_item_id, claim_id, item_name, category, status, message, date_submitted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, item_status_id, lost_item_id, claim_id, item_name, category, statusToStore, message, date_submitted],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to move to trash', error: err.message });

          db.query(
            `DELETE FROM user_item_status WHERE id = ? AND user_id = ?`,
            [item_status_id, userId],
            (err2) => {
              if (err2) return res.status(500).json({ message: 'Failed to remove from status', error: err2.message });

              if (!claim_id) return res.status(201).json({ message: 'Moved to trash!' });

              db.query(
                `UPDATE claims_items SET status = 'Trashed' WHERE id = ? AND user_id = ?`,
                [claim_id, userId],
                (err3) => {
                  if (err3) return res.status(500).json({ message: 'Failed to update claim status', error: err3.message });
                  // Notify admin of cancellation
                  createAdminNotification('Claim Cancelled by User', 'A claim request has been cancelled by the user.');
                  res.status(201).json({ message: 'Moved to trash!' });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.getUserTrash = (req, res) => {
  db.query(
    `SELECT * FROM user_trash_items WHERE user_id = ? ORDER BY trashed_at DESC`,
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch trash', error: err.message });
      res.status(200).json({ items: results });
    }
  );
};

exports.deleteUserTrashForever = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM user_trash_items WHERE id = ? AND user_id = ?`,
    [id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete', error: err.message });
      res.status(200).json({ message: 'Deleted forever!' });
    }
  );
};

exports.restoreUserTrashItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    `SELECT * FROM user_trash_items WHERE id = ? AND user_id = ?`,
    [id, userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to restore', error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Trash item not found' });

      const t = results[0];

      db.query(
        `INSERT INTO user_item_status (user_id, lost_item_id, claim_id, item_name, category, status, message, date_submitted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          t.lost_item_id || null,
          t.claim_id || null,
          t.item_name,
          t.category,
          t.status,
          t.message,
          t.date_submitted ? new Date(t.date_submitted).toISOString().split("T")[0] : null
        ],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Failed to re-insert status', error: err2.message });

          if (!t.claim_id) {
            return db.query(
              `DELETE FROM user_trash_items WHERE id = ? AND user_id = ?`,
              [id, userId],
              (err4) => {
                if (err4) return res.status(500).json({ message: 'Failed to remove from trash', error: err4.message });
                res.status(200).json({ message: 'Restored successfully!' });
              }
            );
          }

          db.query(
            `UPDATE claims_items SET status = ? WHERE id = ? AND user_id = ?`,
            [t.status, t.claim_id, userId],
            (err3) => {
              if (err3) return res.status(500).json({ message: 'Failed to restore claim status', error: err3.message });

              db.query(
                `DELETE FROM user_trash_items WHERE id = ? AND user_id = ?`,
                [id, userId],
                (err4) => {
                  if (err4) return res.status(500).json({ message: 'Failed to remove from trash', error: err4.message });
                  res.status(200).json({ message: 'Restored successfully!' });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.getCalendarEvents = (req, res) => {
  const sql = `
    SELECT 
      c.id, c.pickup_date, c.pickup_time,
      COALESCE(l.name, 'Unknown Item') AS item_name,
      l.category
    FROM claims_items c
    LEFT JOIN lost_items l ON c.lost_item_id = l.id
    WHERE c.user_id = ? AND c.status = 'Approved' AND c.pickup_date IS NOT NULL
    ORDER BY c.pickup_date ASC, c.pickup_time ASC
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch calendar events', error: err.message });
    res.status(200).json({ events: results });
  });
};

exports.dismissCancelNotif = (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE claims_items SET has_cancel_notif = 0 WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to dismiss notif', error: err.message });
      res.status(200).json({ message: 'Notif dismissed!' });
    }
  );
};