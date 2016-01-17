N-1
===

## Build and run the app locally

##### Install [Node & NPM](http://nodejs.org) globally

##### Install local `Node modules` and `Bower components`
* Under the project root, run `npm install`
 * You don't have to run `bower install` because it will be run automatically after `npm install` is finished
 
##### Build the app locally
* Under the project root, run `gulp` for dev builds or `gulp --env=prod` for prod builds

##### Start the app locally
* Under the project root, run `http-server -a 0.0.0.0 -p 8000`

##### Shorthand
* All the above steps can be __AVOIDED__ by just running the following under the project root
 * __`npm start`__
 
##### Run in browser
* Go to URL `http://localhost:8000`

## About styles

##### The BEM standard
* The CSS implementation of this app is strictly following the [BEM methodology](https://en.bem.info/method/)
 * [BEM key concept](https://en.bem.info/method/key-concepts/)
 * [BEM Naming convention](https://en.bem.info/method/naming-convention/)
