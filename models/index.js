const Sequelize = require('sequelize');
// 모델 연결
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

// db 에 객체 담기
db.User = User;
db.Comment = Comment;

// 각각의 모델의 static init 호출 (테이블이 모델로 연결)
User.init(sequelize);
Comment.init(sequelize);

// 다른 테이블과의 관계를 연결하는 associate 메서드도 미리 실행
User.associate(db);
Comment.associate(db);

module.exports = db;
