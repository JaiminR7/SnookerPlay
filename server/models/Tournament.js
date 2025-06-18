import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Tournament title is required'],
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  location: { 
    type: String, 
    required: [true, 'Tournament location is required'],
    trim: true
  },
  date: { 
    type: Date, 
    required: [true, 'Tournament date is required'],
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid date format'
    }
  },
  image: { 
    type: String,
    trim: true
  },
  registrationFee: { 
    type: String,
    trim: true
  },
  prizePool: { 
    type: String,
    trim: true
  },
  time: { 
    type: String, 
    required: [true, 'Tournament time is required'],
    trim: true
  },
  rules: [{
    type: String,
    trim: true
  }],
  schedule: [{
    type: String,
    trim: true
  }],
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed'], 
    default: 'upcoming' 
  },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  maxParticipants: { 
    type: Number, 
    default: 8,
    min: [2, 'Minimum 2 participants required'],
    max: [8, 'Maximum 8 participants allowed']
  },
  fixtures: [{
    round: { 
      type: Number, 
      required: true,
      min: 1,
      max: 3
    },
    matchNumber: { 
      type: Number, 
      required: true,
      min: 1
    },
    player1: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    player2: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    winner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed'], 
      default: 'pending' 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
TournamentSchema.index({ date: 1, status: 1 });

export default mongoose.model('Tournament', TournamentSchema);
