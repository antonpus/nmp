'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    rate: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  });
  Review.associate = function(models) {
    Review.belongsTo(models.Product)
  };
  return Review;
};