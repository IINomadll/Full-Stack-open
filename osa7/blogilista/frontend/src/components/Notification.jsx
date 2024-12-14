import { useNotificationValue } from "../contexts/NotificationContext";

const Notification = () => {
  const { message, error } = useNotificationValue();

  if (message === null && error === null) return null;
  return message !== null ? (
    <div className="notification">{message}</div>
  ) : (
    <div className="error">{error}</div>
  );
};

export default Notification;
