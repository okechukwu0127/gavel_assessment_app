#!/bin/bash

echo "hi there. we will now install the dependencies and start the app"

echo "#1 npm install in ./server"
cd ./server/
npm install

echo "#2 npm install in ./app"
cd ../app
npm install

# if you face difficulties with the environment try the following 2 commands
# npm install --legacy-peer-deps
# npx @react-native-community/cli doctor

echo "#3 pod install in ./app/ios"
cd ./ios
pod install

echo "#4 start apps"
cd ../ #app
npm run ios
#npm run android

echo "#5 start server and open browser"
cd ../server
open "http://localhost:3000/"
npm run server

echo "running"
echo "🙌"

exit 1



