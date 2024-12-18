const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
    try {
        if (!currentUserId) {
            return [];
        }

        const currentUserConversation = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver');

        const conversation = currentUserConversation.map((conv) => {
            const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
                const msgByUserId = curr?.msgByUserId?.toString();

                if (msgByUserId !== currentUserId) {
                    return prev + (curr?.seen ? 0 : 1);
                } else {
                    return prev;
                }
            }, 0);

            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: conv.messages?.[conv?.messages?.length - 1]
            };
        });

        return conversation;
    } catch (error) {
        console.error("Error in getConversation:", error.message);
        return [];
    }
};

module.exports = getConversation;
