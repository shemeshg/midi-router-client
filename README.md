# Advanced Midi Router Client

## v0.12.0

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

## Built With

See [Vue cli](https://cli.vuejs.org/config/).

## Authors

* **shemeshg**

## License

Copyright 2020 shemeshg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
