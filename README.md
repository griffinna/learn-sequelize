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