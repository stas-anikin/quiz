
exports.up = function(knex) {
  return knex.schema.createTable('hashtags', table =>{
      table.increments('id');
      table.string('hashtag');
      table.integer('count');
      table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('hashtags');
};