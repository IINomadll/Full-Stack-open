const Notification = ({ message, error }) => {
  if (message === null && error === null) return null;
  return message !== null ? (
    <div className="notification">{message}</div>
  ) : (
    <div className="error">{error}</div>
  );
};

export default Notification;
