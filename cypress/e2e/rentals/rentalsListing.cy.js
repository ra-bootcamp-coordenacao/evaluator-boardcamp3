/// <reference types="cypress" />

describe('Listar aluguéis: listagem', () => {
  it('Retorna os aluguéis no formato esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "categories" RESTART IDENTITY;
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      TRUNCATE TABLE "rentals" RESTART IDENTITY;
      
      INSERT INTO categories (name) 
      VALUES ('Investigação');

      INSERT INTO games
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ('Banco Imobiliário', 'http://imagembonita.jpg', 3, 1, 150);

      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Thiago', 11999999999, 01123465789, '1995-02-23');

      INSERT INTO rentals ("customerId", "gameId", "daysRented", "originalPrice") 
      VALUES (1, 1, 3, 40), (1, 1, 2, 500), (1, 1, 7, 15);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      expect(response.body).to.have.length(3);
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('customerId');
      expect(response.body[0]).to.have.property('gameId');
      expect(response.body[0]).to.have.property('daysRented');
      expect(response.body[0]).to.have.property('returnDate');
      expect(response.body[0]).to.have.property('originalPrice');
      expect(response.body[0]).to.have.property('delayFee');
      expect(response.body[0]).to.have.property('customer');
      expect(response.body[0]).to.have.property('game');
    });
  });

  it('Inclui os objetos aninhados de jogo e cliente?', () => {
    cy.request('/rentals').then(response => {
      expect(response.body[0].customer).to.have.property('id');
      expect(response.body[0].customer).to.have.property('name');
      expect(response.body[0].game).to.have.property('id');
      expect(response.body[0].game).to.have.property('name');
      expect(response.body[0].game).to.have.property('categoryId');
    });
  });
});
