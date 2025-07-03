import React, { useEffect, useState } from 'react';
import { SiStarlingbank } from "react-icons/si";
import axios from 'axios';

const Newnotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notificationsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [updata, setUpdata] = useState(false);

  const token = localStorage.getItem("token");

useEffect(() => {
  axios.get("https://backndvoo.voo-hub.com/api/admin/noti/view", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then((res) => {
    const formatted = res.data.requests_data.map(item => {
      let title = "";
      if (item.request_type === "event") {
        title = `New request to join event "${item.event?.name || ''}"`;
      } else if (item.request_type === "task") {
        title = `New request to join task "${item.task?.name || ''}"`;
      }
      return {
        id: item.id,
        text: title,
        is_read: item.view_request === 1,
        details: `
          Request by: ${item.user?.name || 'Unknown'}\n
          Organization: ${item.orgnization?.name || 'Unknown'}\n
          Status: ${item.status}
        `
      };
    });

    setNotifications(formatted);

    const unreadCount = formatted.filter(n => !n.is_read).length;
    if (unreadCount > 0) {
      axios.post("https://backndvoo.voo-hub.com/api/admin/noti/view_notification", {
        notification_num: unreadCount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch((err) => {
        console.error("Failed to send unread notification count", err);
      });
    }
  });
}, [updata]);


  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

const handleOpenDetails = (notif) => {
  setSelectedNotification(notif);

  if (notif.is_read) return; // ✅ متبعتش API لو كانت مقروءة

  axios
    .post(
      `https://backndvoo.voo-hub.com/api/admin/noti/view_request/${notif.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notif.id ? { ...n, is_read: true } : n
        )
      );
    })
    .catch((err) => {
      console.error("Failed to mark notification as read", err);
    });
};


  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full px-4 py-6" dir="ltr">
      <h1 className="text-one text-4xl text-center font-bold mb-6">Notifications</h1>

      <div className="flex flex-col gap-4">
        {currentNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleOpenDetails(notif)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-md flex gap-2 items-center ${
              notif.is_read ? 'bg-gray-100 text-gray-600' : 'bg-seven text-one'
            }`}
          >
            <SiStarlingbank className="text-xl" />
            {notif.text}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={goToPrev}
          disabled={currentPage === 1}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-bold text-one">Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      {selectedNotification && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl flex items-center gap-4 p-6 w-[90%] max-w-2xl border-[3px] border-one">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-one">Notification Details</h2>
              <pre className="text-gray-700 whitespace-pre-wrap mb-4">{selectedNotification.details}</pre>
              <button
                onClick={handleCloseDetails}
                className="bg-one text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newnotification;
