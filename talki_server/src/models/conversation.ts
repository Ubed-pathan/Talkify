import mongoose, {Document, Model, Schema } from 'mongoose';

interface IConversation extends Document {
    conversation : mongoose.Types.ObjectId[];
    lastMessage : Date;
}

const conversationSchema : Schema<IConversation> = new mongoose.Schema({
    conversation : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User',
        required : true,

    },

    lastMessage: {
        type : Date,
    }
}, {timestamps: true});

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;