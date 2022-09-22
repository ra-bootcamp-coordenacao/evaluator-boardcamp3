/// <reference types="cypress" />

describe('Listar jogos: busca', () => {
  it('Retorna os jogos filtrados pela busca (case insensitive)?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      INSERT INTO "games" 
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ('Banco Imobiliário', 'http://imagembonita.jpg', 3, 1, 1500), ('Detetive', 'http://imagembonita.jpg', 3, 2, 2500);
      
      SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories ON categories.id = games."categoryId";
      `,
    }).then(result => {
      expect(result[4].rows[0].name).to.have.string('Banco Imobiliário');
    });

    cy.request('/games?name=de').then(response => {
      expect(response.body).to.have.length(1);
      expect(response.body[0].name).equal('Detetive');
    });
  });
});
