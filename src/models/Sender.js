import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SenderSchema = new Schema(
    {
        sender: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Sender', SenderSchema);
