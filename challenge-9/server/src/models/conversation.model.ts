import { Schema,model } from "mongoose";

const ConversationSchema = new Schema({
    particapate:[{
        type:Schema.Types.ObjectId,
        ref:'Users'
    }],
    messages:[{
        type:Schema.Types.ObjectId,
        ref:'Message',
        default:[]
    }],
    
},{timestamps:true})

const ConversationModel = model('Conversation',ConversationSchema)

export default ConversationModel