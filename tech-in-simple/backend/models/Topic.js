const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous requests if they aren't logged in
    },
    topic: {
        type: String,
        required: true
    },
    responses: {
        kid: String,
        student: String,
        interview: String,
        analogy: String,
        one_liner: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
