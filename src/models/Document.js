import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
    {
        documentName: {
            type: String,
            minlength: 1,
            maxlength: 500,
            trim: true,
            required: true,
        },
        note: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        number: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        sendDate: {
            type: String,
            trim: true,
            required: true,
        },
        code: {
            type: String,
            minlength: 1,
            maxlength: 200,
            trim: true,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            trim: true,
        },
        issuedDate: {
            type: String,
            trim: true,
            required: true,
        },
        sender: {
            type: String,
            minlength: 1,
            maxlength: 500,
            trim: true,
            required: true,
        },
        currentLocation: {
            type: String,
            trim: true,
        },
        level: {
            type: String,
            default: 'Bình thường',
        },
        documentIn: {
            type: Boolean,
            required: true,
        },
        attachFiles: {
            type: Array,
            trim: true,
            default: [],
        },
        isHaveTask: {
            type: Boolean,
            default: false,
        },
        assignTo: {
            type: Array,
            default: [],
        },
        status: {
            type: String,
            default: 'Khởi tạo',
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Document', DocumentSchema);
