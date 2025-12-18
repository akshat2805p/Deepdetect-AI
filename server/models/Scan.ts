import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    result: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    scanDate: { type: Date, default: Date.now },
    // New Fields
    title: { type: String },
    author: { type: String },
    language: { type: String },
    analysis: {
        perplexity: Number,
        burstiness: Number,
        similarityScore: Number,
        aiProbability: Number
    },
    comparative_analysis: [{
        metric: String,
        observed: String,
        benchmark: String,
        status: String
    }]
});

export const Scan = mongoose.model('Scan', scanSchema);
