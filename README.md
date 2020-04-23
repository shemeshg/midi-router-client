# Advanced Midi Router Client

## v0.10.0

[Compiled server and client for OSX or linux:](https://sourceforge.net/projects/midi-router-client/)

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

For linux server please also

`sudo apt-get install librtmidi-dev`


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
