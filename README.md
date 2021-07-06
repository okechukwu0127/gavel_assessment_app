# gavel

## welcome to the short coding challenge

first, please set your name and ip address in the `env.json` file, to make the server and app interact with each other smoothly.

the `env.json` file should look similar to:

```json
{
  "ip": "192.168.10.158",
  "name": "florian"
}
```

afterwards you can set up the whole environment by running
`start.sh`

after successful installation you can also start the server and app simply by executing `quickstart.sh` or use `npm run [server|ios]` like explained below.

## structure

in `./app/` you find the app code (react native)

in `./server/` you find the server-side code (node)

the app and the server has its own package.json, so keep attention to your location, in case you execute `npm install [newpackage]`.

## run the server

for us it is very important not only to test you, but also to offer you an insight about how our solution is set up and how development with us will look like. so we included a little piece of our server-side code as well to give you a complete picture. please check, if you feel comfortable and motivated to optimize such an application. we made the challenge test-app depending on the server, so start the server before the app.

`cd ./server`
`npm run server`

## run the app

most of the challenge is within the react native app code. please tell us afterwards if you checked your developments in Android or iOS. you don't have to care about both platforms – just select your favourite one.

`cd ./app`
`npm run ios`
`npm run android`

if you install new npm packages within the `./app` folder, think about installing the iOS pods `cd ./ios; pod install` or clean the Android build `cd ./android; ./gradlew clean` if you face strange behaviour.

## the challenge

for more information about the challenge, you have to start the app and check out the instructions in the app's UI and the screens's code.

for more information about how to submit the challenge, you have to start the server and open the welcome page on http://localhost:3000. the URL is mentioned in the node logs in your terminal as well.

in the case you face any issues, drop me a line at florian@letsgavel.com
