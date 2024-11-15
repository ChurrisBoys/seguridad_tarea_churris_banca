# Churrisbank

## Objective
The object of this project is to explore the generation of secure applications. Churrisbank is both a social network and a banking service where users can follow other users, befriend other users (which happens when two users follow each other), post to their wall (which followers can see) and have their personal profile (which only their friends can access). Users can also create transactions from their banking account to other user's account by using a digital certificate (which is a file generated using ssl).

In order to create transactions, a CGI server was created in order to manage requests to the database and answer back to the main server.

The project's objective is mostly related to the backend of the application, in order to be able to implement as many security controls as possible in the given time frame for the project. 

## Technologies used
The application was implemented using ReactJS, NodeJS, Javascript, MariaDB databases, and CGI server implemented in C++.

## How to use
Churisbank is designed to work in the academic computing cloud of the University of Costa Rica. Due to time restrictions in order to access the web page, users need to modify their host files in order to include: 

    172.24.131.195 equipo1_churris.cb

It is also needed to include the digital certificates for churrisbank in your trusted browser certificates. 

Also, all users (students of the security course) received a user and password in order to access their accounts. 

Only users from the same network can use the system. In order to access Churrisbank, once the setup is done click here [link](https://equipo1_churris.cb:3000/).

## Security analysis 
You can access the security analysis document (only available in spanish) [here](./Churrisbanca_DocumentacionSeguridad.pdf)