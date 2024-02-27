import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
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
        avatar: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        // userName: {
        //     type: String,
        //     trim: true,
        //     required: true
        // },
        department: {
            type: String,
            trim: true,
        },
        isReqChangeInfo: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        refreshTokens: {
            type: Array,
            default: [],
        },
        role: {
            type: String,
            default: 'Member', // default: 'User'
        },
        isActived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model('User', UserSchema);
