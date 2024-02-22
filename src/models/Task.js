import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        taskName: {
            type: String,
            minlength: 1,
            maxlength: 500,
            trim: true,
            required: true,
        },
        type: {
            type: String,
        },
        level: {
            type: String,
            default: 'Bình thường',
        },
        dueDate: {
            type: String,
            trim: true,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'Còn hạn',
        },
        progress: {
            type: String,
            default: 'Đang xử lý',
        },
        desc: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
        refLink: {
            type: String,
            trim: true,
        },
        resources: {
            type: Array,
            default: [],
        },
        attachFiles: {
            type: Array,
            trim: true,
            default: [],
        },
        assignTo: {
            type: Array,
            trim: true,
            default: [],
        },
        leader: {
            type: Object,
        },
        isUndo: {
            type: Object,
            default: {
                flag: false,
                msg: '',
            },
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Task', TaskSchema);
