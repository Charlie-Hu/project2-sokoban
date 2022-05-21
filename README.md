# project

# 1.Overview
This game is a small game about pushing boxes. The player needs to push the box to the corresponding place, and use the up, down, left, and right keys on the keyboard to control the direction. When the game cannot continue or the player makes a mistake, you can use the reset button to restart the game. A game will generate points and enter the next level, the points can be viewed in the ranklist, and players can also choose the difficulty of the game.


# 2.Framework for web applications
The web application architecture we applied is Flask. Flask is a lightweight, highly extensible web application "micro" framework that uses the simplest core and allows you to extend various functions through Flask-extension to meet All needs in web application development. In this project, Flask depends on an external library: the Jinja2 template engine

# 3.How to run this web application
## command for this project
1. Activate the python virtual environment: $source venv/bin/activate

2. To run the app: $flask run

3. To stop the app: $^C

4. To exit the environment: $deactivate

Requires python3, flask, venv, and sqlite
## Run steps
1. install python3,sqlite3
2. set up a virtual environment:
    + use pip or another package manager to install virtualenv package 'pip install virtualenv'
    + start the provided virtual environment 'source virtual-environment/bin/activate'
    + This should include flask and all the required packages
3. set FLASk_APP environment variable'export FLASK_APP=Sokoban.py'
4. flask run
5. start the app running on localhost at port 5000,i.e.http://127.0.0.1:5000




# Running the tests

# Contribute and comment
## Authors 
* Zheng Hu& Xiaokai Qu-*[git commit](https://github.com/Charlie-Hu/project/blob/main/commit.txt)*.
