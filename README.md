## Chrome Extensions CLI

A CLI tool built to generate new chrome extensions.The CLI can quickly generate the necessary boilerplate code needed for building the extensions, free of any  dependencies on third party code or libraries (but still giving you the freedom to integrate your preferred libraries or frameworks as you build your extension)



### Installation

`npm i -g chrome-extensions-cli`

The package needs to be installed on global npm scope so that it can be used directly as a cli


### Usage

`chrome-extensions-cli generate`

The `generate` command will trigger the node script responsible for the generating of the boilerplate code. The CLI will guide you through the process and generate only the code which you will need in the extension.

```
$ chrome-extensions-cli generate

 > Enter the name of your extension: Hello World
 > Enter the description of your extension: A simple hello-world extension created using the chrome-extensions-cli npm package.
 > Include background service worker? (y/n): y
 > Include content scripts? (y/n): y
 > Include popup? (y/n): y
 > Include options page? (y/n): y

Extension generated successfully!

```

### Features

- <b>Zero Dependencies:</b> The generated code does not include any third-party code or libraries, giving you complete control over your project.

- <b>Customizable:</b> Choose whether to include background service workers, content scripts, popups, and options pages.

- <b>Quick Start:</b>: Get started with your Chrome extension development quickly with a structured boilerplate.

<!-- ### License

This project is licensed under the MIT License - see the LICENSE file for details. -->

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


### Contact

If you have any questions or feedback, please reach out at ankur1812vu@gmail.com.

