/// <reference types="cypress" />

describe('Finalizar aluguel: status code', () => {
  it('Retorna 200 no sucesso?', () => {
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
      VALUES (1, 1, 3, 400), (1, 1, 2, 21), (1, 1, 7, 18);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const rentalToClose = response.body.find(rental => !rental.returnDate);
      cy.request('POST', `/rentals/${rentalToClose.id}/return`, {}).then(response => {
        expect(response.status).equal(200);
      });
    });
  });

  it('Retorna 404 caso o aluguel não exista?', () => {
    cy.request({
      method: 'POST',
      url: '/rentals/0/return',
      failOnStatusCode: false,
      body: {},
    }).then(response => {
      expect(response.status).equal(404);
    });
  });

  it('Retorna 400 caso o aluguel já tenha sido finalizado antes?', () => {
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

      INSERT INTO rentals 
      ("customerId", "gameId", "daysRented", "returnDate", "originalPrice") 
      VALUES 
      (1, 1, 3, '2022-03-04', 300), 
      (1, 1, 2,'2022-03-07', 20), 
      (1, 1, 7, '2022-03-12', 142);
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const rentalToClose = response.body.find(rental => rental.returnDate);
      cy.request({
        method: 'POST',
        url: `/rentals/${rentalToClose.id}/return`,
        failOnStatusCode: false,
        body: {},
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });
});
