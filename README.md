# Ivan Todosiuk — Portfolio

A compact personal portfolio with a restrained editorial style. The site uses semantic HTML, responsive CSS and vanilla JavaScript without a UI framework.

## Structure

- `index.html` contains the page structure and content.
- `styles.css` contains the visual system, responsive layouts and motion.
- `script.js` handles navigation, scroll reveals, sculpture movement and the contact modal.
- `js/expertise.js` contains the interactive expertise component and its data.

## Editing expertise

Open `js/expertise.js` and update the `expertiseData` object. Each category contains a short note and a list of technologies:

```js
backend: {
  note: "Short category description.",
  technologies: ["Node.js", "Python"]
}
```

The component updates the technology panel and manages keyboard-accessible tabs automatically.

## Local preview

Open `index.html` directly in a browser or serve the repository with any local static server.
