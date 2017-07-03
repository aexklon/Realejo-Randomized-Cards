# Realejo Randomized Cards
Realejo takes json input and, using react, renders it in the browser as randomized cards with custom functionalities and css classes.

![README.GIF](https://github.com/al-lopes/Realejo-Randomized-Cards/raw/master/README.gif)

## Install
Clone this repository and install its dependencies with `npm install --dev-only` and `bower install`, then run `gulp`.

### Usage
Once the application is compiled and the included express server is started (by simply running `gulp`), you can access it at http://127.0.0.1/

## Customization
The entry point is the file `./src/index.ejs`, which request all css/js and loads the react application (`./src/app.jsx`). The app then requests the file `demo.json`, whose structure should follow this example:
```javascript
[
 {
  "id": "1",          // unique identifier of the current object, could be referenced by other objects
  "nextId": "3",      // optional unique identifier of the next object, if present will be rendered as an anchor to the next object at the end of the card content
  "previousId": "2",  // optional unique identifier of the previous object, if present will be rendered as an anchor to the previous object at the beginning of the card content
  "heig.": "14",      // optional specifier, not currently rendered
  "color": "pink",    // optional specifier, rendered as a thematic css class. See app-theme.scss for all thematic classes
  "special": "pre",   // optional specifier, rendered as a structural css class. See app.scss .card for all specials					
  "content": "Lorem Ipsum" // Content will be rendered as the main text in the card
 }
]
```

### Utility
The included file `./src/demo.xlsx` can be used as a template and compiled to json running `gulp xlsxj`

## License
MIT © [Alexandre Lopes](https://alexandrelopes.design)
