// users 테이블과 연결
const Sequelize = require('sequelize');

// 모델명: 단수형 (User)
// 테이블명: 복수형 (users)
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {    // 테이블 컬럼 설정
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            create_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {        // 테이블 옵션
            // static init 메서드의 매개변수와 연결되는 옵션 (db.sequelize 객체를 넣음)
            sequelize,          
            // true: 생성, 수정시 시간이 자동으로 입력 (createAt, updateAt 컬럼 추가)
            timestamps: false,  
            // default: camel case 에서 snake case (create_at) 로 변경하는 옵션
            underscored: false, 
            // 모델 이름을 설정 (노드 프로젝트에서 사용)
            modelName: 'User',
            // 실제 데이터베이스의 테이블 이름 (복수형 사용)
            tableName: 'users',
            // true: 데이터 로우 원복 가능
            // deleteAt 컬럼 생성됨 (로우를 삭제할 때 완전히 지워지지않고 deleteAt 에 시간 기록)
            // 로우 조회시에는 deleteAt = null 인 로우를 조회
            paranoid: false,
            charset: 'utf8',            // 한글입력
            collate: 'utf8_general_ci', // 한글입력
        });
    }
    static associate(db) {} // 다른 모델과의 관계 작성
}