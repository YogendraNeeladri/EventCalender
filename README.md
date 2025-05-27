# EventCalender--> 
livelink:  https://event-calender-git-main-yogiyadav1970-gmailcoms-projects.vercel.app
# React Event Calendar

A modern, responsive event calendar built with React, Material-UI, and Redux. This calendar application allows users to manage events with features like drag-and-drop, recurring events, and persistent storage.

## Features

- Monthly calendar view with navigation
- Add, edit, and delete events
- Drag and drop events to reschedule
- Support for recurring events (daily, weekly, monthly)
- Responsive design for mobile and desktop
- Persistent storage using localStorage
- Modern Material-UI design
- Event conflict management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-calendar
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Usage

- Click on any date to add a new event
- Drag and drop events to reschedule them
- Click the edit or delete icons on an event to modify or remove it
- Use the month navigation arrows to move between months
- Set recurring events using the recurrence dropdown in the event form

## Technologies Used

- React
- Redux Toolkit for state management
- Material-UI for components and styling
- date-fns for date manipulation
- react-beautiful-dnd for drag and drop functionality
- localStorage for data persistence

## Project Structure

```
src/
  ├── components/
  │   ├── Calendar.js
  │   ├── EventCard.js
  │   └── EventForm.js
  ├── store/
  │   ├── index.js
  │   └── slices/
  │       └── eventsSlice.js
  ├── App.js
  └── index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
