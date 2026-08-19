# Virsha Arif — Software Engineer

Personal portfolio for **Virsha Arif**: Full-Stack Web (MERN) and Flutter developer based in Kharian, Pakistan. The site is a single-page experience — intro, experience, selected work, stack, credentials, and a contact form.

**Live:** [virshaarif.github.io/portfolio](https://virshaarif.github.io/portfolio/)  
**GitHub:** [github.com/virshaarif](https://github.com/virshaarif)  
**LinkedIn:** [virsha-arif](https://www.linkedin.com/in/virsha-arif-183285323/)

Open to on-site, hybrid, and remote roles.

---

## Overview

The portfolio presents 20+ shipped web and mobile products, internships (U Devs, Airafy Digitals, Zyphora Sattar Tech), and downloadable CVs (full-stack, MERN, Flutter). Layout is editorial: dark theme, glass navigation, scroll progress, and motion that stays usable on phones.

## Features

- Sections: Hero, About, Experience, Work, Stack, Education & credentials, Contact
- Responsive nav with mobile drawer
- Project cards with live / source links where available
- Resume downloads (full-stack, MERN, Flutter)
- Contact form with client validation and PHP handler (`contact.php`)
- Honeypot + session rate limit on the server
- Custom loader, scroll progress, skip-to-content, PWA manifest and favicons
- Accessibility: skip link, ARIA on menus and live regions

## Tech stack

| Layer | Tools |
| --- | --- |
| Markup | HTML5 |
| Style | CSS3 (custom properties, grid, glass UI) |
| Interaction | Vanilla JavaScript |
| Contact API | PHP (JSON responses, mail + log) |
| Fonts | Outfit, Playfair Display, Cormorant Garamond, JetBrains Mono |
| Hosting | GitHub Pages (static). PHP form needs a PHP host (e.g. shared hosting) |

**Shown on the site (product work):** React, Node, MongoDB, Express, Flutter, Dart, Firebase, REST APIs, Tailwind, Shopify Liquid, Git.

## Project structure

```
portfolio/
├── index.html              # Page markup
├── style.css               # Theme and layout
├── script.js               # Nav, motion, form submit
├── contact.php             # POST handler (mail + storage/messages.jsonl)
├── site.webmanifest        # PWA icons and theme
├── assets/                 # Photos, logos, project stills
├── storage/                # Contact log (gitignored content)
├── flutter& mern_resume.pdf
├── mern-resume-virsha.pdf
└── flutter-resume-virsha.pdf
```

## Run locally

Static preview (no PHP):

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open `http://localhost:8080`. The contact form only sends mail when `contact.php` runs on a PHP server with `mail()` (or equivalent) enabled.

PHP locally (example):

```bash
php -S localhost:8080
```

## Selected work (on the page)

| Project | Notes |
| --- | --- |
| Amazon Warehouse Store Management | Featured — HTML, CSS, Bootstrap 5, JS |
| Airplane Management System | [Live](https://virshaarif.github.io/task_02_UDev/) |
| Spotify Clone | [Live](https://virshaarif.github.io/Spotify/) · [Code](https://github.com/virshaarif/Spotify) |
| COVID-19 Tracker | Flutter + REST · [Code](https://github.com/virshaarif/Corona_App.git) |
| E-Commerce App | Flutter · [Code](https://github.com/virshaarif/e-commerce_app.git) |
| Trash Treasure | MERN · [Code](https://github.com/virshaarif/trash_treasure.git) |
| CoffeeBar | [Live](https://virshaarif.github.io/coffee-bar-website/) |
| Chat App | Flutter · Firebase |
| Bakes by Mini | HTML / CSS / JS |

Also listed: Netflix, Twitter/X, Weather, university transport, Shelogix, Wanderlust, and more.

## Contact

- **Email:** [virshaarif59@gmail.com](mailto:virshaarif59@gmail.com)
- **Phone:** [+92 326 7938891](tel:+923267938891)
- **Instagram:** [virsha_rajpoot789](https://www.instagram.com/virsha_rajpoot789/)
- **X:** [VirshaArif](https://x.com/VirshaArif)

---

© 2026 Virsha Arif · Software Engineer · MERN & Flutter
