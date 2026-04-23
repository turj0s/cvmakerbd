# CV Maker BD

CV Maker BD is a modern, browser-based resume builder that helps users create professional CVs quickly with a live preview.

## Overview

This project is a single-page web application built with plain HTML, CSS, and JavaScript. It provides a form-driven editor, instant CV preview, dynamic section management, and export options.

## Features

- Live CV preview while typing
- Form sections for:
  - Personal details
  - Work experience
  - Education
  - Skills
  - Projects
  - Certifications
  - Languages
  - Volunteer experience
- Add and remove repeatable entries (experience, education, skills, etc.)
- Undo last change
- Reset to sample data
- Auto-save using browser localStorage
- Download as PDF
- Download as Word document (.docx)
- Mobile-friendly editor/preview controls

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Bootstrap 5 (CDN)
- Font Awesome (CDN)
- Google Fonts (CDN)

## Project Structure

- `index.html` - Main application layout and UI structure
- `style.css` - Visual design, responsive layout, and print styles
- `script.js` - Application logic, state handling, rendering, and export actions
- `CV Generator Web App Development.md` - Development planning and notes

## Getting Started

No build tool or package installation is required.

1. Clone the repository:

```bash
git clone https://github.com/turj0s/cvmakerbd.git
cd cvmakerbd
```

2. Run locally:

- Open `index.html` directly in your browser, or
- Use a lightweight local server for best behavior (recommended).

Example with VS Code Live Server extension:
- Right click `index.html`
- Click **Open with Live Server**

## Usage

1. Fill in your personal and professional information in the editor panel.
2. Add multiple entries for sections like experience and education.
3. Check the live preview panel to verify formatting.
4. Click **Download PDF** or **Download Word** to export your CV.

## Data Persistence

The app stores user data in the browser using localStorage. This means:

- Your edits remain available after refresh (same browser/device)
- Data is not sent to a backend server

## Roadmap Ideas

- Multiple CV templates/themes
- Better print customization options
- Cloud save/login support
- Import from LinkedIn or JSON
- Multi-language UI support

## Repository

GitHub: https://github.com/turj0s/cvmakerbd
