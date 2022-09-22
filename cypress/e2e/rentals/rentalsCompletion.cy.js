/// <reference types="cypress" />

const dayjs = require('dayjs');

describe('Finalizar aluguel: finalização', () => {
  it('Atualiza o returnDate para a data atual?', () => {
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

      INSERT INTO rentals ("customerId", "gameId", "daysRented") 
      VALUES (1, 1, 3), (1, 1, 2), (1, 1, 7);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    const rentalId = 1;
    cy.request('POST', `/rentals/${rentalId}/return`, {}).then(() => {
      cy.request('/rentals').then(response => {
        const rental = response.body.find(rental => rental.id === rentalId);

        const returnDate = dayjs(rental.returnDate).format('YYYY-MM-DD');
        expect(returnDate).equal(dayjs().format('YYYY-MM-DD'));
      });
    });
  });

  // it('Calcula o delayFee conforme requisito?', () => {
  //   cy.task('db:insertRental')
  //   .then(response => {
  //     const rentalInfos = {...response};

  //     cy.request('POST', `/rentals/${rentalInfos.rentalId}/return`, {})
  //     .then(() => {
  //       cy.request('/rentals')
  //       .then(response => {
  //         const rental = response.body
  //         .find(rental => rental.id === rentalInfos.rentalId);

  //         const today = dayjs();
  //         const rentDate = dayjs(rental.rentDate);
  //         const dateDifference = today.diff(rentDate, 'day');
  //         const fee = (dateDifference - rental.daysRented)
  //         * rentalInfos.game.pricePerDay;

  //         expect(rental.delayFee).equal(fee);
  //       });
  //     });
  //   });
  // });

  it('Caso não tenha atraso, mantém o delayFee como null ou 0?', () => {
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
      VALUES (1, 1, 3, 45), (1, 1, 2, 43), (1, 1, 7, 200);
      SELECT * FROM "rentals";
      `,
    }).then(result => {});

    cy.request('/rentals').then(response => {
      const rentalToClose = response.body.find(rental => !rental.returnDate);
      cy.request('POST', `/rentals/${rentalToClose.id}/return`, {}).then(() => {
        cy.request('/rentals').then(response => {
          const rental = response.body.find(rental => rental.id === rentalToClose.id);
          const delayFeeIsCorrect = !rental.delayFee;
          expect(delayFeeIsCorrect).equal(true);
        });
      });
    });
  });
});
