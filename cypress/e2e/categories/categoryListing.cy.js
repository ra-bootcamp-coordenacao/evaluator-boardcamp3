/// <reference types="cypress" />

describe('Listar categorias', () => {
  it('Retorna as categorias no formato esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "categories" RESTART IDENTITY;
      INSERT INTO categories (name) 
      VALUES ('Investigação'), ('Ação');
      SELECT * FROM "categories";
      `,
    }).then(result => {
      expect(result[2].rows[0].name).to.have.string('Investigação');
    });

    cy.request('/categories').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(2);
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('name');
    });
  });
});
