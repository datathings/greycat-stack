# GreyCat Stack

This repository contains a full stack of GreyCat.
In a nutshell this is an assembly from a model module, cross- compiled both in Java, JS and TypeScript, a server in Java and various Clients in TS, Java, JavaFX.
This project aims at showing how to start a GreyCat project and how models can be synchronized among various server/gui/browser.

# Usage

1. First, open this project in an IDE. We advise to user the excellent IDEA IntelliJ.
1. Then, compile the stack and prepare Node config file using:
   
    ``` sh
    mvn clean install
    ```
    
1. Start the Server (WebSocket GateWay)
    
    `(idea run) server/src/main/java/Server.java`
    
    data are located under a `data` directory at the root of your project. Fell free to delete to restart the experiment.
1. Run a simple client

    `(idea run) client/src/main/java/Client.java`

    a sensor is actually added to the graph

1. Run a JavaFX client

    `(idea run) client/src/main/java/ClientFX.java`

    click on the button, a sensor is actually added to the graph

1. Run a Web React App

    ``` sh
    cd web
    npm install
    npm start (or npm build to create production ready bundle)
    ```

    your browser will be open at localhost:3000, repeat operation with Clients to see sensors added to the list in a reactive way.

1. Happy hackin!

## Model

The model is mainly based on a file descriptor under `src/main/gcm/model.gcm`. Please consider the plugin [https://plugins.jetbrains.com/plugin/9771-greycat-idea](https://plugins.jetbrains.com/plugin/9771-greycat-idea) to edit the file with convenient editor.

## Server

This server expose a graph equipped with generated model as a WebSocket gateway (port 8081)

## Client

This client use classical Java 8 api to append a sensor node to the graph. Fell free to hack the Client.java or ClientFX.java files.

## Web

This is a react project. You can open it in IDEA Ultimate or Visual Web Studio as a package.json is included.
This project shows programming API with TypeScript and the GreyCat generated API.
Fell free to edit any .tsx file and see the result in live in the browser.
