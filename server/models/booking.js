import { model, Schema } from 'mongoose';

const BookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    pickupTime: {
        type: Date,
        required: true
    },
    deliveryTime: {
        type: Date,
        required: true
    },
    address: {
        type: string,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const BookingModel = model('Booking', BookingSchema);