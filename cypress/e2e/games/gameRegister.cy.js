/// <reference types="cypress" />

describe('Inserir jogo: inserção', () => {
  it('Salva o jogo conforme esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      `,
    });

    cy.getCategory(0).then(category => {
      cy.request('POST', '/games', {
        name: 'War',
        image: 'https://github.com/teste.jpg',
        stockTotal: 8,
        categoryId: category.id,
        pricePerDay: 200,
      }).then(() => {
        cy.task('DATABASE', {
          dbConfig: Cypress.env('DB'),
          sql: ` 
          TRUNCATE TABLE "categories" RESTART IDENTITY;

          INSERT INTO "categories" (name) 
          VALUES ('Investigação'), ('Ação');
          
          SELECT games.*, categories.name as "categoryName" FROM games
          JOIN categories ON categories.id = games."categoryId";
          `,
        }).then(result => {
          expect(result[2].rows[0].name).to.have.string('War');
        });

        /* cy.request('/games').then(response => {
          expect(response.body).to.have.length(1);
          expect(response.body[0].name).equal('War');
        }); */
      });
    });

    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      INSERT INTO games
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ('War', 'http://imagembonita.jpg', 3, 1, 1500);

      SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories ON categories.id = games."categoryId";
      
      `,
    }).then(result => {
      expect(result[3].rows[0].name).to.have.string('War');
    });
  });
});
