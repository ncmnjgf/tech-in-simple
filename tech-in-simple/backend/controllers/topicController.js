const { getSheetData, writeSheetData, uuidv4 } = require('../db/excel');

const saveTopic = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
    
    const { topic, responses } = req.body;
    let topics = getSheetData('Topics');

    const newTopic = {
      id: uuidv4(),
      userId: req.user.id,
      topic,
      kid: responses.kid || '',
      student: responses.student || '',
      interview: responses.interview || '',
      analogy: responses.analogy || '',
      one_liner: responses.one_liner || '',
      createdAt: new Date().toISOString()
    };

    topics.push(newTopic);
    writeSheetData('Topics', topics);

    res.status(201).json({ message: 'Topic saved to Excel successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save topic to Excel' });
  }
};

const getSavedTopics = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    let topics = getSheetData('Topics');
    // Filter by user ID and map back to frontend expected structure
    const userTopics = topics.filter(t => t.userId === req.user.id).map(t => ({
      _id: t.id,
      topic: t.topic,
      responses: {
        kid: t.kid,
        student: t.student,
        interview: t.interview,
        analogy: t.analogy,
        one_liner: t.one_liner
      },
      createdAt: t.createdAt
    }));
    
    // Send newest first
    res.json(userTopics.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch topics from Excel' });
  }
};

const deleteSavedTopic = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    let topics = getSheetData('Topics');
    const originalLength = topics.length;
    
    // Filter out the exact topic matching both Topic ID and User ID
    topics = topics.filter(t => !(t.id === req.params.id && t.userId === req.user.id));
    
    if (topics.length === originalLength) {
      return res.status(404).json({ error: "Topic not found or unauthorized" });
    }

    writeSheetData('Topics', topics);
    res.json({ message: "Topic removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete topic from Excel' });
  }
};

module.exports = { saveTopic, getSavedTopics, deleteSavedTopic };
