// server/src/routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');
const logger = require('../config/logger');

const { auth } = authMiddleware;

// GET /api/messages/conversations - Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.getUserConversations(req.user.id);
    
    // Format the conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const lastMessage = conv.lastMessage;
      const otherUser = lastMessage.sender[0]._id.toString() === req.user.id 
        ? lastMessage.recipient[0] 
        : lastMessage.sender[0];
      
      return {
        id: conv._id,
        participant: {
          id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar || otherUser.name.split(' ').map(n => n[0]).join('')
        },
        lastMessage: {
          content: lastMessage.content,
          timestamp: lastMessage.createdAt,
          isFromMe: lastMessage.sender[0]._id.toString() === req.user.id
        },
        unreadCount: conv.unreadCount
      };
    });
    
    res.json({
      success: true,
      data: formattedConversations
    });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// GET /api/messages/:userId - Get conversation with specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.getConversation(
      req.user.id,
      req.params.userId,
      parseInt(limit),
      (parseInt(page) - 1) * parseInt(limit)
    );
    
    // Mark messages as read
    await Message.updateMany({
      recipient: req.user.id,
      sender: req.params.userId,
      isRead: false
    }, {
      isRead: true,
      readAt: new Date()
    });
    
    res.json({
      success: true,
      data: messages.reverse() // Reverse to show oldest first
    });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// POST /api/messages - Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content, type = 'text', attachments = [] } = req.body;
    
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and content are required'
      });
    }
    
    const conversationId = Message.createConversationId(req.user.id, recipientId);
    
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      type,
      attachments,
      conversationId
    });
    
    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('recipient', 'name avatar');
    
    logger.info(`Message sent from ${req.user.email} to user ${recipientId}`);
    
    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(400).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Only recipient can mark as read
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark your own messages as read'
      });
    }
    
    await message.markAsRead();
    
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    logger.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
});

// DELETE /api/messages/:id - Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Only sender can delete message
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }
    
    message.deleted = true;
    message.deletedAt = new Date();
    await message.save();
    
    logger.info(`Message deleted by ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// POST /api/messages/:id/react - Add reaction to message
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    
    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user.id && r.emoji === emoji
    );
    
    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === req.user.id && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        user: req.user.id,
        emoji
      });
    }
    
    await message.save();
    
    res.json({
      success: true,
      message: existingReaction ? 'Reaction removed' : 'Reaction added'
    });
  } catch (error) {
    logger.error('Error managing reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error managing reaction',
      error: error.message
    });
  }
});

module.exports = router;
