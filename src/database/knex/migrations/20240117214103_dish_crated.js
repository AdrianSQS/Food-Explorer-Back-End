exports.up = knex => knex.schema.alterTable("dishes", table => {
  table.dropForeign('created_by');
  table.dropForeign('updated_by');

  table.foreign("created_by").references("id").inTable("users").onDelete("CASCADE");
  table.foreign("updated_by").references("id").inTable("users").onDelete("CASCADE");
});

exports.down = knex => null;
