const express = require('express');
const router = express.Router();
const { saveTopic, getSavedTopics, deleteSavedTopic } = require('../controllers/topicController');
const { explainTopic, simplifyText, elaborateText } = require('../controllers/explainController');
const { loginUser, registerUser } = require('../controllers/authController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/explain', explainTopic);
router.post('/simplify', simplifyText);
router.post('/elaborate', elaborateText);

router.post('/save', optionalAuth, saveTopic);
router.get('/saved', protect, getSavedTopics);
router.delete('/saved/:id', protect, deleteSavedTopic);

router.post('/auth/login', loginUser);
router.post('/auth/register', registerUser);

module.exports = router;
