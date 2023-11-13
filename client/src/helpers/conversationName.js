const conversationName = (conversation, members, currUser) => {
  if (conversation.isGroup) {
    return conversation.name;
  }
  const otherMem = members.filter((mem) => mem.id !== currUser.id);
  return otherMem[0].name;
};

export default conversationName;
