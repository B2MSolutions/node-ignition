node-ignition
=============

[![Build Status](https://secure.travis-ci.org/B2MSolutions/node-ignition.png?branch=master)](http://travis-ci.org/B2MSolutions/node-ignition)

A big, simple, start and stop button for EC2 instances

## Usage

Set your Amazon access keys to the environment variables *AWS_ACCESS_KEY* and *AWS_SECRET_ACCESS_KEY*.

Start the server

    node server.js
    
Point web browser at:

    http://localhost:3000/[instance id ]/[elastic IP address]
    
Where _instance id_ is the id of the EC2 instance and _elastic IP address_ is the 
elastic IP address that you want to associate the EC2 instance with upon start.

Click the big button to start and stop the instance.