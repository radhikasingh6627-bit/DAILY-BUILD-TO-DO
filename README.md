# Daily Build — Terminal-Style To-Do App

A minimal, terminal-themed to-do list built with plain HTML, CSS, and JavaScript. Tasks are saved in the browser's local storage, so your list persists even after you close the tab.

## Features
- Add tasks with a priority level (low / medium / high)
- Mark tasks as done / pending
- Delete tasks
- Filter tasks by All / Pending / Done
- Live stats (total, done, pending)
- Data persists using `localStorage` — no backend needed
- Fully responsive (works on mobile)

## Tech Stack
- HTML5
- CSS3 (custom properties, flexbox, animations)
- Vanilla JavaScript (DOM manipulation, event delegation, localStorage API)

## How to run locally
1. Clone this repository
   ```bash
   git clone https://github.com/radhikasingh6627-bit/daily-build-todo.git
   ```
2. Open `index.html` in your browser — that's it, no build step or dependencies required.

## What I learned
- Manipulating the DOM without any framework
- Using event delegation instead of adding listeners to every element
- Persisting data in the browser using `localStorage`
- Writing clean, componentized CSS with a consistent design system

## Screenshot
_Add a screenshot here after you push the project — GitHub renders images placed in the repo._

## Future improvements
- Drag-and-drop to reorder tasks
- Due dates and reminders
- Dark/light theme toggle
