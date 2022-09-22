/// <reference types="cypress" />

describe('Inserir cliente: inserção', () => {
  it('Salva o cliente conforme esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      `,
    }).then(result => {});

    cy.request('POST', '/customers', {
      name: 'Maria',
      phone: '21999999999',
      cpf: '22222222222',
      birthday: '1998-06-15',
    });

    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      SELECT * FROM "customers";
      `,
    }).then(result => {
      expect(result.rows[0].name).equal("Maria")
    });

   /*  cy.request('/customers').then(response => {
      expect(response.body).to.have.length(1);
      expect(response.body[0].name).equal('Maria');
    }); */
  });
});
