import * as notificationService from "./notification.service.js";

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, type, is_read, sent_by } = req.query;
    
    const filters = { search, type, is_read, sent_by };
    const notifications = await notificationService.getAllNotifications(userId, filters);
    
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error at getAllNotifications = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createNotification = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { title, message, type } = req.body;
    const image = req.file ? `/uploads/Notification/${req.file.filename}` : null;

    const notification = await notificationService.createNotification(senderId, {
      title,
      message,
      type,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error at createNotification = ", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllUsersForNotification = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await notificationService.getAllUsersForNotification(currentUserId);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error at getAllUsersForNotification = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.getNotificationById(id, userId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error at getNotificationById = ", error);
    
    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, message, type } = req.body;
    const image = req.file ? `/uploads/Notification/${req.file.filename}` : req.body.image;

    const notification = await notificationService.updateNotification(id, userId, {
      title,
      message,
      type,
      image,
    });

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error at updateNotification = ", error);
    
    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await notificationService.deleteNotification(id, userId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error at deleteNotification = ", error);
    
    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, userId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error at markAsRead = ", error);
    
    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markAsUnread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.markAsUnread(id, userId);

    res.status(200).json({
      success: true,
      message: "Notification marked as unread",
      data: notification,
    });
  } catch (error) {
    console.error("Error at markAsUnread = ", error);
    
    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: notifications,
    });
  } catch (error) {
    console.error("Error at markAllAsRead = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Error at getUnreadCount = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
