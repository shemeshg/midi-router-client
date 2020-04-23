# Advanced Midi Router Client

[Compiled server and client for OSX:](https://drive.google.com/file/d/11CmUCZI6s4dZSC6PSf5_3JkKPMArVYH8/view?usp=sharing)

[Compiled server and client for Linux:](https://drive.google.com/open?id=1Evk11elK0Bz3tUgQk6zapEgk_O9-AUyF)

1. Route anywhere to anywhere.
2. Create virtual port.
3. Route from WebMidiJs client to server and back.
4. Route from server to server.
5. All routing in RealTime with no latency.
6. Route from one event type to another. (cc to pitch wheel)
7. Route to/from 14bit CC
8. Monitor midi input.
9. Build Custom controls to send CC/Program Change.
10. Custom Program Change dropdowns.

## Project setup

[Download of project and
server is here: ](https://github.com/shemeshg/RtMidiWrap)

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

usefull for connecting from tablet/phone

### Compiles and minifies for production

```bash
npm run build
```

It is possible to build electron desktop app with 

```bash
npm run electron:build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
