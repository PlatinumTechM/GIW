import * as notificationRepo from "./notification.repo.js";

export const getAllNotifications = async (userId, filters = {}) => {
  const notifications = await notificationRepo.findAllNotifications(userId, filters);
  return notifications;
};

export const getUnreadNotifications = async (userId) => {
  const notifications = await notificationRepo.findUnreadNotificationsByUserId(userId);
  return notifications;
};

export const getNotificationById = async (id, userId) => {
  const notification = await notificationRepo.findNotificationById(id);
  if (!notification) {
    throw new Error("Notification not found");
  }
  return notification;
};

export const createNotification = async (senderId, notificationData) => {
  const { title, message, type, image } = notificationData;

  if (!title || !message) {
    throw new Error("Title and message are required");
  }

  if (!type) {
    throw new Error("Type is required");
  }

  const notification = await notificationRepo.createNotification({
    user_id: senderId,
    sender_id: senderId,
    title,
    message,
    type: type || "natural-diamonds",
    image,
  });

  return notification;
};

export const getAllUsersForNotification = async (currentUserId) => {
  const users = await notificationRepo.getAllUsersForNotification(currentUserId);
  return users;
};

export const updateNotification = async (id, userId, notificationData) => {
  const existingNotification = await notificationRepo.findNotificationById(id);
  if (!existingNotification) {
    throw new Error("Notification not found");
  }

  if (Number(existingNotification.sender_id) !== Number(userId)) {
    throw new Error("You do not have permission to edit this notification");
  }

  const { title, message, type, image } = notificationData;

  if (!title || !message) {
    throw new Error("Title and message are required");
  }

  if (!type) {
    throw new Error("Type is required");
  }

  const updatedNotification = await notificationRepo.updateNotification(id, userId, {
    title,
    message,
    type: type || "natural-diamonds",
    image,
  });

  return updatedNotification;
};

export const markAsRead = async (id, userId) => {
  const existingNotification = await notificationRepo.findNotificationById(id);
  if (!existingNotification) {
    throw new Error("Notification not found");
  }

  const notification = await notificationRepo.markAsRead(id, userId);
  return notification;
};

export const markAsUnread = async (id, userId) => {
  const existingNotification = await notificationRepo.findNotificationById(id);
  if (!existingNotification) {
    throw new Error("Notification not found");
  }

  const notification = await notificationRepo.markAsUnread(id, userId);
  return notification;
};

export const markAllAsRead = async (userId) => {
  const notifications = await notificationRepo.markAllAsRead(userId);
  return notifications;
};

export const deleteNotification = async (id, userId) => {
  const existingNotification = await notificationRepo.findNotificationById(id);
  if (!existingNotification) {
    throw new Error("Notification not found");
  }

  if (Number(existingNotification.sender_id) !== Number(userId)) {
    throw new Error("You do not have permission to delete this notification");
  }

  const deletedNotification = await notificationRepo.deleteNotification(id, userId);
  return deletedNotification;
};

export const getUnreadCount = async (userId) => {
  const count = await notificationRepo.getUnreadCount(userId);
  return count;
};
