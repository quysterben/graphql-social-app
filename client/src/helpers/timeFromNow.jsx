import moment from 'moment';
const timeFromNow = (timestamp) => {
  const time = moment(timestamp).fromNow();
  return time;
};

export default timeFromNow;
