import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema(
    {
        departmentName: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 100,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        note: {
            type: String,
            trim: true,
            maxlength: 120,
            default: '',
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Department', DepartmentSchema);
