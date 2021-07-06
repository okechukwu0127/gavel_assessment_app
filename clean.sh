#!/bin/bash

echo "hi there. we will now clean the project"

echo "#1 delete ios build"
cd ./app/ios
xcodebuild clean
pod cache clean --all
rm -rf Pods

echo "#2 delete android build"
cd ../android
./gradlew clean # if this fails, it is already cleaned (node_modules are missing)
rm -rf ./.gradle
rm -rf ./app/build

echo "#3 delete dependencies"
cd ../../
rm -rf ./app/node_modules
rm -rf ./server/node_modules

echo "cleaned"
echo "🙌"

exit 1



