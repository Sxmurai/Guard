# Guard

A Discord bot written in TypeScript which will provide you with your everyday Discord needs!

## Features
🎵 Music
⭐ Starboard
🛠 Moderation

And much more!

## Self Hosting

1. Clone this repository with: `git clone Sxmurai/Gaurd`
2. CD into the repository
3. Type `npm install` to install all dependencies 
4. Go to the `config.yml` file

It should look something like:

```yaml
bot:
  owners: ["535585397435006987"]
  prefix: "g!"
  id: "663077021487988746"
tokens:
  discord: 
nodes: [
  { 
    id: "Guard 1", 
    host: "localhost", 
    port: 1337, 
    password: "dankpassword" 
  }
]
```

5. Go to tokens.discord and place your token there.
6. Change the token which is inside of the string
7. Download [java](https://www.azul.com/downloads/zulu-community/?architecture=x86-64-bit&package=jdk) and [lavalink](https://github.com/Frederikam/Lavalink/releases)
8. Create a `lavalink` folder.
9. Place all of those files into that folder, then create an [application.yml](https://github.com/Frederikam/Lavalink/blob/master/LavalinkServer/application.yml.example) file, and copy-paste from this link.
10. Change the: `server` part to match with whatever nodes you have.
11. Download the TypeScript compiler: `npm i -g typescript` (you will need administrative/root privilages)
12. Type `tsc` into the console.
13. CD into the `build` folder
14. Type into the console: `node .`

## Contributors

[Sxmurai](https://github.com/Sxmurai/)
