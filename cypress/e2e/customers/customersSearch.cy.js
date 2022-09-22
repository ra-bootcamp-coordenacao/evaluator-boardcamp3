/// <reference types="cypress" />

describe('Listar clientes: busca', () => {
  it('Retorna os clientes filtrados pela busca?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Thiago', 11999999999, 222222222, '1995-02-23');
      SELECT * FROM "customers";
      `,
    }).then(result => {
      expect(result[2].rows[0].name).to.have.string('Thiago');
    });

    cy.request('/customers?cpf=22').then(response => {
      expect(response.body).to.have.length(1);
      expect(response.body[0].name).equal('Thiago');
    });
  });
});
