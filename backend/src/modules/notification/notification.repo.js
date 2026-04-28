import { pool } from "../../config/db.js";

export const findNotificationById = async (id, userId) => {
  const query = `SELECT id, user_id, sender_id, title, message, type, image, 
                        ($2 = ANY(read_by)) as is_read, 
                        created_at, updated_at
                 FROM notifications WHERE id = $1`;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0];
};

export const findAllNotifications = async (userId, filters = {}) => {
  const { search, type, is_read, sent_by } = filters;
  
  let query = `SELECT n.id, n.user_id, n.sender_id, n.title, n.message, n.type, n.image, 
                        ($1 = ANY(n.read_by)) as is_read, 
                        n.created_at, n.updated_at,
                        u.name as sender_name, u.company as sender_company
                 FROM notifications n
                 LEFT JOIN users u ON n.sender_id = u.id`;
  
  const conditions = [];
  const params = [userId];
  let paramIndex = 2;

  if (search) {
    conditions.push(`(n.title ILIKE $${paramIndex} OR n.message ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (type && type !== 'all') {
    conditions.push(`n.type = $${paramIndex}`);
    params.push(type);
    paramIndex++;
  }

  if (is_read && is_read !== 'all') {
    if (is_read === 'read') {
      conditions.push(`$1 = ANY(n.read_by)`);
    } else {
      conditions.push(`NOT ($1 = ANY(n.read_by))`);
    }
  }

  if (sent_by && sent_by !== 'all' && userId) {
    if (sent_by === 'me') {
      conditions.push(`n.sender_id = $${paramIndex}`);
    } else {
      conditions.push(`n.sender_id != $${paramIndex}`);
    }
    params.push(userId);
    paramIndex++;
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY n.created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

export const findUnreadNotificationsByUserId = async (userId) => {
  const query = `SELECT id, user_id, sender_id, title, message, type, 
                        false as is_read, 
                        created_at, updated_at
                 FROM notifications
                 WHERE NOT ($1 = ANY(read_by))
                 ORDER BY created_at DESC`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const createNotification = async (notificationData) => {
  const { user_id, sender_id, title, message, type, image } = notificationData;

  const query = `INSERT INTO notifications
    (user_id, sender_id, title, message, type, image)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, sender_id, title, message, type, image, false as is_read, created_at, updated_at`;

  const result = await pool.query(query, [
    user_id,
    sender_id || null,
    title,
    message,
    type || "natural-diamonds",
    image,
  ]);
  return result.rows[0];
};

export const updateNotification = async (id, userId, notificationData) => {
  const { title, message, type, image } = notificationData;

  const query = `UPDATE notifications
    SET title = $1, message = $2, type = $3, image = $4, updated_at = NOW()
    WHERE id = $5 AND sender_id = $6
    RETURNING id, user_id, sender_id, title, message, type, image, ($6 = ANY(read_by)) as is_read, created_at, updated_at`;

  const result = await pool.query(query, [title, message, type, image, id, userId]);
  return result.rows[0];
};

export const markAsRead = async (id, userId) => {
  const query = `UPDATE notifications 
                 SET read_by = array_append(read_by, $2) 
                 WHERE id = $1 AND NOT ($2 = ANY(read_by))
                 RETURNING id`;

  const result = await pool.query(query, [id, userId]);
  return result.rows[0] || { id }; // Return id even if already read
};

export const markAsUnread = async (id, userId) => {
  const query = `UPDATE notifications 
                 SET read_by = array_remove(read_by, $2) 
                 WHERE id = $1
                 RETURNING id`;

  const result = await pool.query(query, [id, userId]);
  return result.rows[0] || { id };
};

export const markAllAsRead = async (userId) => {
  const query = `UPDATE notifications 
                 SET read_by = array_append(read_by, $1) 
                 WHERE NOT ($1 = ANY(read_by))
                 RETURNING id`;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const deleteNotification = async (id, userId) => {
  const query = `DELETE FROM notifications
    WHERE id = $1 AND sender_id = $2
    RETURNING id`;

  const result = await pool.query(query, [id, userId]);
  return result.rows[0];
};

export const getUnreadCount = async (userId) => {
  const query = `SELECT COUNT(*) as count
                 FROM notifications
                 WHERE NOT ($1 = ANY(read_by))`;
  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count);
};

export const getAllUsersForNotification = async (currentUserId) => {
  const query = `SELECT id, name, email, company
                 FROM users
                 WHERE id != $1 AND is_active = true
                 ORDER BY name ASC`;
  const result = await pool.query(query, [currentUserId]);
  return result.rows;
};
