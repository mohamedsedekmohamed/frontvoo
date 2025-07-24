import React from "react";
import { FaClock } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const RecentEventList = ({ recent_event = [] }) => {
  return (
    <div className="bg-[#F8F3FB] rounded-xl p-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <FaClock className="text-lg text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-700">
          Recent Activity
        </h2>
      </div>

      {recent_event.length === 0 ? (
        <p className="text-gray-500">No recent events.</p>
      ) : (
        <ul className="space-y-3">
          {recent_event.map((event) => {
            const eventDateTime = dayjs(`${event.date}T${event.start_time}`);
            const now = dayjs();
            const isToday = eventDateTime.isSame(now, "day");
            const isYesterday = eventDateTime.isSame(now.subtract(1, "day"), "day");

            let displayTime;
            if (isToday) {
              displayTime = `Today at ${eventDateTime.format("hh:mm A")}`;
            } else if (isYesterday) {
              displayTime = "Yesterday";
            } else {
              displayTime = eventDateTime.fromNow(); // e.g. "3 days ago"
            }

            return (
              <li
                key={event.id}
                className="bg-white rounded-lg shadow-sm px-4 py-2 flex justify-between items-center"
              >
                <div className="text-gray-800 font-medium truncate">
                  Event: "{event.name}"
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
                  <FaClock className="text-xs" />
                  {displayTime}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentEventList;
