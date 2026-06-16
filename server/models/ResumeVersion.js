import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    label: {
      type: String,
      default: 'Auto-save',
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Keep only last 50 versions per resume
resumeVersionSchema.post('save', async function () {
  const count = await this.constructor.countDocuments({ resumeId: this.resumeId });
  if (count > 50) {
    const oldest = await this.constructor
      .find({ resumeId: this.resumeId })
      .sort({ savedAt: 1 })
      .limit(count - 50);
    const ids = oldest.map((v) => v._id);
    await this.constructor.deleteMany({ _id: { $in: ids } });
  }
});

const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);
export default ResumeVersion;
