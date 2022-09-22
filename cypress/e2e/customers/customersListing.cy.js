/// <reference types="cypress" />

describe('Listar clientes: listagem', () => {
  it('Retorna os clientes no formato esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Thiago', 11999999999, 01123465789, '1995-02-23');
      SELECT * FROM "customers";
      `,
    }).then(result => {
      expect(result[2].rows[0].name).to.have.string('Thiago');
    });

    cy.request('/customers').then(response => {
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('phone');
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0]).to.have.property('birthday');
    });
  });
});
