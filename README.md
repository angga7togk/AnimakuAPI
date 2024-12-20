<p align="right">
  <img src="https://raw.githubusercontent.com/angga7togk/angga7togk/refs/heads/main/toga-chibi.png" width="5%">
</p>

<p align="center">
  <a href="https://github.com/angga7togk">
    <img src="https://i.pinimg.com/originals/30/dd/0a/30dd0aa01adf2eaef4692801e6ffb6fb.gif" width="50%">
  </a>
</p>

<h1 align="center">Animaku API</h1>
<p align="center">
  <strong>
    AnimakuAPI is a library for free anime streaming websites
  </strong>
</p>

---

# Installation

```bash
npm i animaku
```

## Usage

ESMODULE
```ts
import { animaku } from 'animaku';

animasu.getAnimes({
  page: 1,
  search: 'naruto', 
  limit: 10,
  sort: 'update'
}).then(console.log);
```

CommonJS
```js
const animaku = require('animaku');

animaku.animasu.getAnimes({
  page: 1,
  search: 'naruto',
  limit: 10,
  sort: 'update'
}).then(console.log);
```
