/// <reference types="cypress" />

describe('Listar aluguéis: busca', () => {
  it('Retorna os aluguéis filtrados pela busca de jogo?', () => {
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
      VALUES (1, 1, 3, 200), (1, 1, 2, 400), (1, 1, 7, 30);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const gameId = response.body[0].gameId;
      cy.request(`/rentals?gameId=${gameId}`).then(response => {
        const gameRentals = response.body.filter(rental => rental.gameId === gameId);

        expect(gameRentals.length).equal(response.body.length);
      });
    });
  });

  it('Retorna os aluguéis filtrados pela busca de cliente?', () => {
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
      VALUES (1, 1, 3, 25), (1, 1, 2, 12), (1, 1, 7, 54);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const customerId = response.body[0].customerId;
      cy.request(`/rentals?customerId=${customerId}`).then(response => {
        const customerRentals = response.body.filter(rental => rental.customerId === customerId);

        expect(customerRentals.length).equal(response.body.length);
      });
    });
  });
});
