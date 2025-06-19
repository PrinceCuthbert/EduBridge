import React from "react";
import "../../css/ResourcesPage/liveClasses.css";

function LiveClassesTab() {
  return (
    <div className="container">
      <h1 className="live-title">Live Classes & Schedule</h1>
      <p className="live-subtext">
        Join interactive live sessions with expert instructors from around the
        world.
      </p>

      <div className="cards">
        {/* Class Card 1 */}
        <div className="card">
          <div className="card-header">
            <h2>Advanced Mathematics</h2>
            <span className="platform">📹 Google Meet</span>
          </div>
          <p className="instructor">Prof. Sarah Johnson</p>
          <p className="datetime">📅 Today</p>
          <p className="time">🕒 2:00 PM - 3:30 PM</p>
          <p className="students">👥 45 students enrolled</p>
          <button className="join-btn">▶ Join Now</button>
        </div>

        {/* Class Card 2 */}
        <div className="card">
          <div className="card-header">
            <h2>Korean Language Basics</h2>
            <span className="platform">💻 Zoom</span>
          </div>
          <p className="instructor">Kim Min-jun</p>
          <p className="datetime">📅 Tomorrow</p>
          <p className="time">🕒 4:00 PM - 5:00 PM</p>
          <p className="students">👥 32 students enrolled</p>
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live+Class+on+JavaScript&dates=20250620T150000Z/20250620T160000Z&details=Join+us+for+a+live+session+on+JavaScript+fundamentals&location=Online"
            target="_blank"
            rel="noopener noreferrer"
            className="reminder-btn">
            🗓 Set Reminder
          </a>
        </div>

        {/* Class Card 3 */}
        <div className="card">
          <div className="card-header">
            <h2>Python Programming</h2>
            <span className="platform">📹 Google Meet</span>
          </div>
          <p className="instructor">Dr. Michael Chen</p>
          <p className="datetime">📅 Dec 2</p>
          <p className="time">🕒 6:00 PM - 7:30 PM</p>
          <p className="students">👥 28 students enrolled</p>
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live+Class+on+JavaScript&dates=20250620T150000Z/20250620T160000Z&details=Join+us+for+a+live+session+on+JavaScript+fundamentals&location=Online"
            target="_blank"
            rel="noopener noreferrer"
            className="reminder-btn">
            🗓 Set Reminder
          </a>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <h2>📅 Upcoming Classes Calendar</h2>
        <p>View all scheduled live classes and set up reminders</p>
        <div className="calendar-box">
          <p>📆 Calendar integration coming soon</p>

          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live+Class+on+JavaScript&dates=20250620T150000Z/20250620T160000Z&details=Join+us+for+a+live+session+on+JavaScript+fundamentals&location=Online"
            target="_blank"
            rel="noopener noreferrer"
            className="calendar-btn">
            🗓 Add to Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}

export default LiveClassesTab;
