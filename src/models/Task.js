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
            type: String, // no required => nullable; required => 1 -> ?; default => ???
        },
        describe: {
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
            default: 'Còn hạn',
            required: true,
        },
        progress: {
            type: String,
            default: 'Đang xử lý',
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
