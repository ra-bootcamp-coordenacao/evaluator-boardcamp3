/// <reference types="cypress" />

describe('Inserir aluguel: status code', () => {
  it('Retorna 201 no sucesso?', () => {
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
        daysRented: 5,
      }).then(response => {
        expect(response.status).equal(201);
      });
    });
  });

  it('Retorna 400 quando o id de jogo ou cliente sao inválidos? - gameId inválido', () => {
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
    cy.getGameAndCustomer(0, 0).then(({ customer }) => {
      cy.request({
        method: 'POST',
        url: '/rentals',
        failOnStatusCode: false,
        body: {
          customerId: customer.id,
          gameId: 0,
          daysRented: 5,
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 quando o id de jogo ou cliente sao inválidos? - customerId inválido', () => {
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
    cy.getGameAndCustomer(0, 0).then(({ game }) => {
      cy.request({
        method: 'POST',
        url: '/rentals',
        failOnStatusCode: false,
        body: {
          customerId: 0,
          gameId: game.id,
          daysRented: 5,
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 quando o daysRented não é maior que 0?', () => {
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
      cy.request({
        method: 'POST',
        url: '/rentals',
        failOnStatusCode: false,
        body: {
          customerId: customer.id,
          gameId: game.id,
          daysRented: 0,
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 caso não tenha mais o jogo em estoque', () => {
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

    cy.insertRental('Teste1').then(({ customer, game }) => {
      cy.request({
        method: 'POST',
        url: '/rentals',
        failOnStatusCode: false,
        body: {
          customerId: customer.id,
          gameId: game.id,
          daysRented: 2,
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });
});
