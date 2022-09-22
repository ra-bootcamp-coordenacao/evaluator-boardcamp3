/// <reference types="cypress" />

const dayjs = require('dayjs');

describe('Inserir aluguel: inserção', () => {
  it('Salva o aluguel conforme esperado?', () => {
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
      ('Banco Imobiliário', 'http://imagembonita.jpg', 100, 1, 150);

      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Thiago', 11999999999, 01123465789, '1995-02-23');

      `,
    }).then(result => {});

    cy.getGameAndCustomer(0, 0).then(({ game, customer }) => {
      cy.request('POST', '/rentals', {
        customerId: customer.id,
        gameId: game.id,
        daysRented: 3,
      }).then(() => {
        cy.request('/rentals').then(response => {
          expect(response.body).to.have.length(1);
        });
      });
    });
  });

  it('Insere a data de aluguel corretamente?', () => {
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

      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") 
      VALUES 
      (1, 1, 3, '2022-09-19', 300);
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const rental = response.body[0];
      const rentDate = dayjs(rental.rentDate).format('YYYY-MM-DD');
      expect(rentDate).equal('2022-09-19');
    });
  });

  it('Calcula o originalPrice corretamente?', () => {
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
      VALUES 
      (1, 1, 3, 450);
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const rental = response.body[0];
      const gameId = rental.gameId;
      cy.request('/games').then(response => {
        const games = response.body;
        const game = games.find(g => g.id === gameId);
        expect(game.pricePerDay * rental.daysRented).equal(rental.originalPrice);
      });
    });
  });

  it('Insere returnDate e delayFee como null?', () => {
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
      VALUES 
      (1, 1, 3, 450);
      `,
    }).then(result => {});
    cy.request('/rentals').then(response => {
      const rental = response.body[0];
      const { returnDate, delayFee } = rental;
      expect(returnDate).equal(null);
      expect(delayFee).equal(null);
    });
  });
});
