import unittest, os
from app import app, db
from app.models import User

class UserModelCase(unittest.TestCase):
    def setUp(self):
        basedir = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI']=\
            'sqlite:///' + os.path.join(basedir,'app.db')
        self.app = app.test_client()
        db.create_all()

        u1 = User(id='1',username='Test_User1',email='qqqq@qqq.com')
        u2 = User(id='2',username='Test_User2',email='wwww@www.com')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all

    def test_avatar(self):
        u = User(username='john', email='john@example.com')
        self.assertEqual(u.avatar(128), ('https://www.gravatar.com/avatar/'
                                         'd4c74594d841139328695756648b6bd6'
                                         '?d=identicon&s=128'))

    def test_password_hash(self):
        u = User.query.get("1")
        u.set_password('test1')
        self.assertFalse(u.check_password('test'))
        self.assertTrue(u.check_password('test1'))

if __name__ == '__main__':
    unittest.main(verbosity=2)