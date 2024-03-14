# Al Noor Prayer


<p align="center">
  <img src="./assets/icon.png" alt="Tamagui Icon"/>
</p>



## Quick Start
Just run the following, changing `yourappname` to the name of your project.
```
npx create-expo-app yourappname -t tamagui-expo-template --no-install
cd yourappname
yarn install
```
If you have [Expo Go](https://expo.dev/client) app installed, just start your new app with `yarn start`, if not, create your own [Development Client](https://docs.expo.dev/development/build/)

## What you get
This is a starter template for [Expo](https://expo.dev) using [Tamagui](https://tamagui.dev).
In this template you get out of the box:
- Semantic Release already configured with everything you might want
- Expo Router up and running
- Tamagui, a nice and modern way of building your UIs
- ESLint and Prettier configurations

## What you don't get
- Expo Web support (for this, go to the [Official Tamagui Starter](https://github.com/tamagui/tamagui))
- i18n
- Global State management

## If you want to...
1. You can build your own dev client with `eas build -p android --profile development`
1. Develop in WSL, use the `yarn wsl` command, else `yarn start` is your default choice.

## Troubleshooting
### I'm on WSL but my app doesn't connect
WSL2 runs inside its own container, so it doesn't share the same IPv4 and port status as your host machine, you might need [this](https://gist.github.com/ivopr/64f974e632b7edcbe1f5e58b91e31598)

