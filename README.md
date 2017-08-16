# Ape E Eye

This is a toy project I built to learn Angular JS. It's a configurable dashboard of "searches" (API queries) which are periodically updated. 

It's hosted on GitHub as [http://github.com/flakey-bit/ape-e-eye](http://github.com/flakey-bit/ape-e-eye)

## Getting Started

From within the checkout directory, execute

```npm install```

to install the required dependencies. Then run 

```npm run dev```

to start the development server.

### Prerequisites

* NodeJS (7.9.0)
* TypeScript should be installed globally (2.4.2)
* Webpack should be installed globally (2.6.0)
* The Webpack dev server should be installed globally (2.4.5)

## Running the tests

From the project checkout directory run

```npm run test```

## Built With

* [Angular1.6](https://angularjs.org/) - The web framework used
* [NodeJS](https://nodejs.org/) - Dependency Management
* [CodeMirror](https://codemirror.net/) - Used for the JavaScript code editing feature

## Contributing

Not currently accepting external contributions.

## Authors

* **Eddie Stanley** [FlakeyBit](https://github.com/flakey-bit)

## FAQ

* *Why did you build this? There's already x/y/z out there which does a better job*  
    I built it to get familiar with AngularJS & Webpack (having built SPAs with other tools before).  

* *Aren't there horrible security implications with all the user-supplied JS?*  
    Probably. Of course it doesn't let you do anything you can't already do with the Chrome developer window... That said, there's a TODO for executing the user data handlers using a WebWorker.  

* *Why did you use AngularJS when there's Angular2/React/HotNewThing2000?*  
    Because I set out to learn Angular1.x.  

* *Why did you do things from scratch rather than using Bootstrap/library-xyz?*  
    Because it's a pet project and I get to do what I want.  

* *Why aren't you using SASS/Babel/build-chain tool xyz?*  
    Because I wanted to keep things as simple as possible  

* *Why doesn't it have feature x/y/z?*  
    Because it's a pet project built in my free time. If there is interest in the project then perhaps I'll consider improving it in the future.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details