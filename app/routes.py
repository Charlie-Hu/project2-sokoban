from dataclasses import dataclass
from flask import render_template, flash, redirect, url_for, jsonify, request
from app import app
from app.forms import LoginForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from werkzeug.urls import url_parse
from app import db
from app.forms import RegistrationForm, EditProfileForm
from datetime import datetime
from werkzeug.security import generate_password_hash
from sqlalchemy import desc, asc
import sqlite3

@app.route('/')

@app.route('/index')
@login_required
def index():    
    return render_template("index.html", title='Sokoban')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sokoban', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, score_val=0, cur_level=0)
        user.set_password(form.password.data)

        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Sokoban', form=form)

@app.route('/rank_list/<username>')
@login_required
def rank_list(username):
    score_val_rank = User.query.order_by(desc('score_val')).all()
    cur_level_rank = User.query.order_by(desc('cur_level')).all()
    person_info = User.query.filter_by(username=username).first()
    return render_template('rank_list.html',score_val_rank=score_val_rank,cur_level_rank=cur_level_rank,person_info=person_info)

@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()

@app.route('/edit_pwd')
def edit_pwd():
    return render_template("edit_pwd.html", title='Sokoban')

@app.route('/check_exists', methods=['GET', 'POST'])
def check_exists():
    result={'code':'','id':''}

    username = request.form.get('username')
    email = request.form.get('email')
    user = User.query.filter_by(username=username,email=email).first()

    if user:
        result['code'] = 400
        result['id'] = user.id
    else:
        result['code'] = 200
        result['id'] = 'There is no matching account at present'
    return jsonify(result)


@app.route('/edit_pwd_rel/<id>')
def edit_pwd_rel(id):
    return render_template("edit_pwd_rel.html", title='Sokoban',id=id)

@app.route('/update_password', methods=['GET', 'POST'])
def update_pwd():
    result={'code':'','id':''}

    id = request.form.get('id')
    pwd = request.form.get('pwd')

    try:
        user = User.query.filter_by(id=id).first()
        user.password_hash = generate_password_hash(pwd)
        db.session.commit()

        result['code'] = 400
        result['id'] = 'Success'
        return jsonify(result)
        
    except Exception as e:
        result['code'] = 200
        result['id'] = 'Update fail'
        return jsonify(result)

@app.route('/game_desc')
def game_desc():
    return render_template("game_desc.html", title='Sokoban')

@app.route('/game_start', methods=['GET', 'POST'])
def game_start():
    result={'code':'','username':''}

    user_name = request.form.get('username')
    user = User.query.filter_by(username=user_name).first()

    if user:
        result['code'] = 400
        result['username'] = user.username
        return jsonify(result)
    else:
        result['code'] = 200
        return jsonify(result)

@app.route('/game_start_rel/<username>')
def game_start_rel(username):
    user = User.query.filter_by(username=username).first()
    context={
        'id': user.id,
        'cur_level':user.cur_level
    }
    return render_template("game.html", title='Sokoban',**context)

@app.route('/add_score', methods=['GET', 'POST'])
def add_score():
    result={'code':'','id':''}

    id_val = request.form.get('id')
    cur_level = int(request.form.get('curLevel'))

    try:
        user = User.query.filter_by(id=id_val).first()

        if cur_level > user.cur_level-1:
            user.cur_level = cur_level+1
        user.score_val = user.score_val + cur_level + 1

        db.session.commit()

        result['code'] = 400
        result['id'] = 'Success'
        return jsonify(result)
    except Exception as e:
        print(e)
        result['code'] = 200
        result['id'] = 'Update fail'
        return jsonify(result)
