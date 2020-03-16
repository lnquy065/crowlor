# Auto Selector Query HTML

## Setup

```bash
npm install jsdom and axios and mongodb
```

## Code mẫu

```js
const SelectorApp = require('./selectorapp');
var mongoClient = require("mongodb").MongoClient;
(async() => {
const SelectorApp = require('./selectorapp');
var selectorapp = new SelectorApp("mongodb://admin-root:veHPvhxdqQ5zFthKsFW3IPbX761tmPgiyyPN6U2t7ZhEgNBfav7D6GACgUBvYeHnLmH0OgXNc9zhzFiX06bSEA==@admin-root.documents.azure.com:10255/?ssl=true", "Users", "selectorapp");
selectorapp.Run()
})();
```

3 chế độ:

- innerHTML: lấy HTML trong selector
- value: lấy value 
- NodeList: lấy toàn bộ class trong selector