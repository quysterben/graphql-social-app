const conversationName = (conversation, currUser) => {
  if (conversation.isGroup) {
    return conversation.name;
  }
  const otherMem = conversation.members.filter((mem) => mem.id !== currUser.id);
  return otherMem[0].name;
};

export default conversationName;
