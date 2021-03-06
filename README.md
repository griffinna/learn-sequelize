# Sequelize (시퀼라이즈)
ORM (*Object-relational Mapping*) 으로 분류  
- 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구 
- MariaDB, PostgreSQL, SQLite, MSSQL 등 다른 데이터베이스도 사용가능
- 자바스크립트 구문을 알아서 SQL 로 변환해줌

## MySQL 과 시퀄라이즈 비교
|MySQL|시퀄라이즈|
|---|---|
VARCHAR(100) | STRING(100)
INT | INTEGER
TINYINT | BOOLEAN
DATETIME | DATE
INT UNSIGNED | INTEGER.UNSIGNED
NOT NULL| allowNull: false
UNIQUE | unique: true
DEFAULT now() | defaultValue: Sequelize.NOW

# 테이블 간 관계 정의하기
## - 1 : N (User : Comment)
> hasMany  
belongsTo
- models/user.js
```javascript
static associate(db) {  // 다른 모델과의 관계 작성
    // 1 : N (1명의 User에 Comment 여러건 연결)
    // hasMany - sourceKey
    db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
}
```
- models/comment.js
```javascript
static associate(db) {  // 다른 모델과의 관계 작성
    // belongsTo: 다른 모델의 정보가 들어가는 테이블에 사용
    // belongsTo - targetKey
    db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
} 
```

## - 1 : 1 (User : Info)
> hasOne  
belongsTo
```javascript
db.User.hasOne(db.Info, {foreignKey: 'UserId', sourceKey: 'id'});
// belongsTo 를 사용하는 Info 모델에 UserId 컬럼이 추가됨
db.Info.belongsTo(db.User, {foreignKey: 'UserId', targetKey: 'id'});
```

## - N : M (Post : Hashtag)
> belongsToMany  
through: 두 객체의 아이디가 저장되는 모델 생성
```javascript
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashTag'});
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashTag'});
```

```javascript
db.sequelize.models.PostHashTag
```

# 쿼리
- INSERT
> INSERT INTO nodejs.users (name, age, married, comment)  
     VALUES ('rio', 32, 0, 'hello');
```javascript
const { User } = require('../models');
User.create({   
    name: 'rio',
    age: 32,
    married: false,     // 시퀄라이즈에 정의한 자료형 대로 넣어야함
    comment: 'hello',
});
```
- SELECT ALL
> SELECT * FROM nodejs.users;
```javascript
User.findAll({});
```
- SELECT ONE
> SELECT * FROM nodejs.users LIMIT 1;
```javascript
User.findOne({});
```
- 원하는 컬럼만 SELECT
>SELECT name, married FROM nodejs.users;
```javascript
User.findAll({
    attributes: ['name', 'married'],
});
```
- SELECT with CONDITION
>SELECT name, married  
FROM nodejs.users   
WHERE married = 1 AND age > 30;
```javascript
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['name', 'married'],
    where: {
        married: 1,
        age: { [Op.gt]: 30 },
    }
});
```
>SELECT id, name  
FROM nodejs.users   
WHERE married = 0 OR age > 30;
```javascript
User.findAll({
    attributes: ['id', 'name'],
    where: {
        [Op.or]: [{married: 0}, age: { [Op.gt]: 30 }]
    }
});
```
|||||||||
|---|---|---|---|---|---|---|---|
|gt|gte|lt|lte|ne|or|in|notIn|
|초과|이상|미만|이하|같지 않음|또는|요소 포함|요소 미포함|
- 정렬
> SELECT id, name FROM users ORDER BY age DESC;
```javascript
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
});
```
- LIMIT
> SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
```javascript
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
});
```
- OFFSET
> SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
```javascript
User.findAll({
    attributes: ['id', 'name'],
    order: ['age', 'DESC'],
    limit: 1,
    offset: 1,
});
```
- UPDATE
> UPDATE nodejs.users SET comment = '바꿀내용' WHERE id = 2;
```javascript
User.update({   // 수정할 내용
    comment: '바꿀내용',
}, {            // 수정 대상 데이터 조건
    where: { id: 2 },
});
```
- DELETE
> DELETE FROM nodejs.users WHERE id = 2;
```javascript
User.destroy({
    where: { id: 2 },
});
```

# 관계 쿼리
findOne 이나 findAll 메서드를 호출할 때 프로미스의 결과로 모델을 반환  
(findAll 은 모두 찾는 것이므로 모델의 배열을 반환)
```javascript
const user = await User.findOne({});
console.log(user.nick);
```
## include
```javascript
const user = await User.findOne({
    include: [{ // 관계가 있는 모델
        model: Comment
    }]
});
console.log(user.Comments); // 사용자 댓글

const user = await User.findOne({});
const comments = await User.getComments();
console.log(comments);  // 사용자 댓글
```
- getComments (조회)
- setComments (수정)
- addComment (하나 생성)
- addComments (여러 개 생성)
- removeComments (삭제)

## include - where, attributes 옵션
```javascript
const user = await User.findOne({
    include: [{
        model: Comment,
        where: {
            id: 1
        },
        attributes: ['id'],
    }]
});
// 또는
const comments = await user.getComments({
    where: {
        id: 1,
    },
    attributes: ['id'],
})
```

## 수정, 생성, 삭제
```javascript
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
// 또는
await user.addComment(comment.id);

// 여러건 저장하기
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
awaut user.addComments([comment1, comment2]);
```

## as 옵션
> 동사 뒤의 모델 이름을 바꿀때 사용
```javascript
// 관계를 설정할 때 as로 등록
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id', as: 'Answers'});

// 쿼리
const user = await user.findOne({});
const commnents = await user.getAnswers();
console.log(comments);  // 사용자 댓글
```

## SQL 쿼리
> 직접 SQL 문을 통해 쿼리할 수 있음
```javascript
const [result, metadata] = await sequelize.query('SELECT * FROM comments');
console.log(result);
```