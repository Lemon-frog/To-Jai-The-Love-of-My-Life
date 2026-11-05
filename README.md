# To Jai, The Love of My Life

## About

This project is a personalized browser experience for Jai. It guides the visitor through a short story: a greeting, a courtship question, a moonlit scene, three illustrated promises, and an invitation to dance. The interface combines English poetry with Filipino dialogue and hand-drawn SVG scenes.

The experience is built as a static page. It has no application server, database, or build step; the page and its audio asset can be served by any static web host.

## Features

- Six full-screen scenes connected by animated scrolling transitions
- Custom inline SVG illustrations and decorative effects
- Interactive proposal and dance invitations
- Three original poem cards: “Lantern,” “Serenade,” and “Vow”
- Looping background music that starts after the visitor accepts the proposal
- Responsive layouts and motion adjustments for visitors who prefer reduced motion

## Project files

```text
.
├── index.html   # Page markup, styles, SVG artwork, and interaction logic
├── audio.mp3    # Looping background music
└── README.md
```

## Run locally

You can open `index.html` directly, or serve the folder locally so the page and audio load from the same origin.

With Python installed, run this command from the project directory:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

Alternatively, open the folder with a local static server such as the VS Code Live Server extension.

## Built with

- HTML, CSS, JavaScript, and inline SVG
- [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn)
- [GSAP 3.12.5](https://gsap.com/) and its ScrollToPlugin
- Google Fonts: Cormorant Garamond and Jost

The page loads these libraries and fonts from external CDNs, so an internet connection is needed for the complete styling and animation experience. No package installation or compilation is required.

## Personalize the experience

- Edit the title, dialogue, questions, poem text, and closing lines in `index.html`.
- Replace the inline SVG artwork or adjust the styles and animations in the same file.
- Replace `audio.mp3` with an audio file you are authorized to use. Keep the filename, or update the `<audio>` element in `index.html` to match the new file.

## Deployment

Upload `index.html` and `audio.mp3` together to a static hosting provider. Keep the audio file at the path referenced by the page, and make sure the deployed site can reach the external CDNs listed above.

