#!/bin/sh

cd csaf-validator-lib && npm ci --omit=dev
cd ../backend && npm ci --omit=dev
cd ..

mkdir -p dist

cp -r csaf-validator-lib dist/
cp -r backend dist/
