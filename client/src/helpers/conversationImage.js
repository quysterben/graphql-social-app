const conversationImage = (conversation, members, currUser) => {
  if (conversation.isGroup) {
    return conversation.image;
  }
  const otherMem = members.filter((mem) => mem.id !== currUser.id);
  return otherMem[0].avatar;
};

export default conversationImage;
