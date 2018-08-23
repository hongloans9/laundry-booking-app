import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        required: true
    },
    address: {
        type: string
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const UserModel = mongoose.model('User', UserSchema) 