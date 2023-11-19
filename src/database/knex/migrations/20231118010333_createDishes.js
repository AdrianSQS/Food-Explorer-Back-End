exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.text("image").default(null);
  table.text("category").notNullable();
  table.text("description").notNullable();
  table.decimal("price", 10, 2).notNullable();

  table.integer("created_by").references("id").inTable("users");
  table.integer("updated_by").references("id").inTable("users");

  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dishes");
