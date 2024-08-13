# Bun Image Delivery

This a project i made to self host images and provide my own image resizing via jimp

## How to use

### With Devenv

Just run `dev` in a terminal after setting up direnv

Alternatively Open a dev shell via `devenv shell` then run `dev`

### Without Devenv

To install dependencies:

```bash
bun install
```

To run:
```bash
bun run dev
```

## Building

As of right now to create a build you can use either the compile script or the build script

### With Devenv scripts

To create a plain build run `build`

To create a standalone executable run `compile`

### With Bun scripts

To create a plain build run

```bash
bun run build
```

To create a standalone executable run

```bash
bun run compile
```

## TODO

- [ ] Optimize images
- [x] setup environment variables
- [x] include docker image
