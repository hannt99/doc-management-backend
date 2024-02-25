import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        // userName: {
        //     type: String,
        //     trim: true,
        //     required: true
        // },
        fullName: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 100,
            required: true,
        },
        gender: {
            type: String,
            trim: true,
        },
        birthDate: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: 'Member', // default: 'User'
        },
        department: {
            type: String,
            trim: true,
        },
        isActived: {
            type: Boolean,
            default: false,
        },
        isReqChangeInfo: {
            type: Boolean,
            default: false,
        },
        refreshTokens: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true },
);

export default mongoose.model('User', UserSchema);
