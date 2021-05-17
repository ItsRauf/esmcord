[![GitHub issues](https://img.shields.io/github/issues/ItsRauf/esmcord?style=for-the-badge)](https://github.com/ItsRauf/esmcord/issues)
[![GitHub forks](https://img.shields.io/github/forks/ItsRauf/esmcord?style=for-the-badge)](https://github.com/ItsRauf/esmcord/network)
[![GitHub stars](https://img.shields.io/github/stars/ItsRauf/esmcord?style=for-the-badge)](https://github.com/ItsRauf/esmcord/stargazers)
[![GitHub license](https://img.shields.io/github/license/ItsRauf/esmcord?style=for-the-badge)](https://github.com/ItsRauf/esmcord/blob/main/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/ItsRauf/esmcord?style=for-the-badge)

---

<p align="center">
  <br />
  <a href="https://github.com/ItsRauf/esmcord">
    <img src="https://nobody-loves.me/i/v4rn.png?v=1" alt="Discordium Logo" width="80" height="80">
  </a>
  
  <h3 align="center">ESMCord</h3>

  <p align="center">
    Discord library written in Typescript leveraging the latest ECMAScript features.
    <br />
    <br />
    <a href="https://rauf.wtf/esmcord">Documentation</a>
    &bull;
    <a href="https://github.com/ItsRauf/esmcord/issues">Report a Bug</a>
    &bull;
    <a href="https://github.com/ItsRauf/esmcord/issues">Request a Feature</a>
  </p>
</p>
<br />

## Example Usage

```js
import { Client } from 'esmcord';

const esmcord = new Client(process.env.TOKEN, {
  debug: false,
});

esmcord.on('Ready', time => {
  console.log(`Ready at ${time}`);
});
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
