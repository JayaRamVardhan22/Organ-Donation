import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/organchain')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const donorSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bloodType: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  organs: [{ type: String, required: true }],
  medicalHistory: { type: String },
  emergencyContact: { type: String },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const recipientSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bloodType: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  organNeeded: { type: String, required: true },
  urgencyLevel: { type: Number, required: true, min: 1, max: 10 },
  medicalHistory: { type: String },
  doctorInfo: { type: String },
  status: { type: String, enum: ['waiting', 'matched', 'transplanted'], default: 'waiting' },
  createdAt: { type: Date, default: Date.now }
});

const Donor = mongoose.model('Donor', donorSchema);
const Recipient = mongoose.model('Recipient', recipientSchema);

// Routes
// Donor routes
app.post('/api/donors', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/donors', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/donors/:walletAddress', async (req, res) => {
  try {
    const donor = await Donor.findOne({ walletAddress: req.params.walletAddress });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/donors/:walletAddress', async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { walletAddress: req.params.walletAddress },
      req.body,
      { new: true }
    );
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Recipient routes
app.post('/api/recipients', async (req, res) => {
  try {
    const recipient = new Recipient(req.body);
    await recipient.save();
    res.status(201).json(recipient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/recipients', async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/recipients/:walletAddress', async (req, res) => {
  try {
    const recipient = await Recipient.findOne({ walletAddress: req.params.walletAddress });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    res.json(recipient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/recipients/:walletAddress', async (req, res) => {
  try {
    const recipient = await Recipient.findOneAndUpdate(
      { walletAddress: req.params.walletAddress },
      req.body,
      { new: true }
    );
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    res.json(recipient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});