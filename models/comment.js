// comments 테이블과 연결
const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            create_at: {
                type: Sequelize.DATE,
                allowNull: true, 
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {  // 다른 모델과의 관계 작성
        // belongsTo: 다른 모델의 정보가 들어가는 테이블에 사용
        // belongsTo - targetKey
        db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
    } 
}