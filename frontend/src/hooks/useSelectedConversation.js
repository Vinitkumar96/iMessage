import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

//Vinit kuumar => Vk   => ['v','k']
export function getInitials(namePassed) {
  return namePassed
    .split(" ")
    .map((words) => words[0])
    .join("");
}

// message in ui form

function mapMessage({ user, messages, authUser, onlineUsers }) {
  const mappedMessages = messages.map((message) => ({
    id: message._id,
    role: String(message.senderId) === String(authUser?._id) ? "me" : "them",
    text: message.text || "",
    imageUrl: message.image,
    videoUrl: message.video,
    time: formatMessageTime(message.createdAt)
  }));

  return {
    id: user._id,
    peer : {
        name: user.fullName,
        subtitle: user.email,
        isOnline: onlineUsers.includes(user._id),
        avatarUrl : user.profilePic,
        initials : getInitials(user.fullName)
    },
    messages: mappedMessages
  }
}


export function useSelectedConversation(){
    const activeConversationId = useChatStore((state) => state.activeConverationId);
    const conversations = useChatStore((state) => state.conversations);
    const users = useChatStore((state) => state.users);
    const messages = useChatStore((state) => state.messages);

    const authUser = useAuthStore((state) => state.authUser);
    const onlineUsers= useAuthStore((state) => state.onlineUsers);

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    const selectedUser = activeConverationId ? 
    users.find((user) => user._id === activeConverationId) ||
    conversations.find((user) => user._id === activeConverationId) : null;

    const activeConversation = selectedUser ? mapMessage({user : selectedUser, messages
        ,authUser,onlineUsers
    }) : null

    return {
        activeConversation,
        activeConversationId,
        isLargeScreen
    }
}