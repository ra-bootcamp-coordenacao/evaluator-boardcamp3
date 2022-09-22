/// <reference types="cypress" />

describe('Listar jogos: listagem', () => {
  it('Retorna os jogos no formato esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');
      
      INSERT INTO games
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ('Banco Imobiliário', 'http://imagembonita.jpg', 3, 1, 1500), 
      ('Imagem e Ação', 'http://imagembonita.jpg', 3, 2, 2500);
      
      SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories ON categories.id = games."categoryId";
      `,

    }).then((result) => {
      expect(result[4].rows[0].name).to.have.string("Banco Imobiliário")
    });
    
    cy.request('/games').then(response => {
      expect(response.body).to.have.length(2);
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('image');
      expect(response.body[0]).to.have.property('stockTotal');
      expect(response.body[0]).to.have.property('categoryId');
      expect(response.body[0]).to.have.property('pricePerDay');
    });
  });

  it('Traz o nome da categoria junto?', () => {
    cy.request('/games').then(response => {
      expect(response.body[0]).to.have.property('categoryName');
    });
  });
});
