/// <reference types="cypress" />

describe('Inserir categoria: inserção', () => {
  it('Salva a categoria conforme esperado?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "categories" RESTART IDENTITY;
      `,
    }).then(result => {})

    cy.request('POST', '/categories', { name: 'Investigação' })

    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      SELECT * FROM "categories" WHERE name='Investigação';
      `,
    }).then((result) => {
      expect(result.rows[0].name).to.have.string("Investigação")
    });

    /* cy.request('/categories').then(response => {
      expect(response.body[0].name).equal('Investigação');
      expect(response.body[0]).to.have.property('id');
    }); */
  });
});
