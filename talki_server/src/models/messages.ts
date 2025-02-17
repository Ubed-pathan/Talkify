import mongoose, { Document, Schema, Model, model } from 'mongoose';


interface IMessage extends Document {
    message?: string;
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    typeOfMessage: 'text' | 'image' | 'video';
    contentURL?: string;
    date: string;
}

const messageSchema: Schema<IMessage> = new Schema({
    message: {
        type: String,
        required: function(this: IMessage) {
            return this.typeOfMessage === 'text';
        },
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    typeOfMessage: {
        type: String,
        enum: ['text', 'image', 'video'],
        required: true,
    },
    contentURL: {
        type: String,
        required: function(this: IMessage) {
            return this.typeOfMessage === 'image' || this.typeOfMessage === 'video';
        },
    },
    date:{
        type: String,
        required: true,
    }
}, { timestamps: true });

const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);

export default Message;
