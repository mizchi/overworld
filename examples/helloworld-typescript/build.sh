#!/usr/bin/env sh
tsc -m commonjs -t es5 --outDir lib src/initialize.ts
webpack
