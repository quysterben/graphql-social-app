const handleBannedUser = (error) => {
  if (error.message === 'User banned') {
    localStorage.clear();
    window.location.reload = '/login';
  }
};

export default handleBannedUser;
