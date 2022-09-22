/// <reference types="cypress" />

describe('Atualizar cliente: atualização', () => {
  it('Atualiza o cliente conforme esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Joana', 88888888888, 21222222222, '1995-02-23');
      SELECT * FROM "customers";      `,
    });

    cy.getCustomer(0).then(customer => {
      cy.request('PUT', `/customers/${customer.id}`, {
        name: 'Joaquina',
        cpf: '33333333333',
        phone: customer.phone,
        birthday: customer.birthday,
      }).then(() => {
        cy.task('DATABASE', {
          dbConfig: Cypress.env('DB'),
          sql: `
          SELECT * FROM "customers" WHERE name='Joaquina';      `,
        }).then(result => {
          expect(result.rows[0].name).equal('Joaquina');
        });
      });
    });
  });
});
