/// <reference types="cypress" />

describe('Inserir categoria: status code', () => {
  it('Retorna 201 no sucesso?', () => {

    cy.request('POST', '/categories', { name: 'Estratégia' }).then(response => {
      expect(response.status).equal(201);
    });
  });
  

  it('Retorna 400 quando o nome está vazio?', () => {
    cy.request({
      method: 'POST',
      url: '/categories',
      failOnStatusCode: false,
      body: {
        name: '',
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 409 quando já existe uma categoria com o mesmo nome?', () => {

    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO categories (name) 
      VALUES ('Investigação');
      `,
    }).then(result => {})

    cy.request({
      method: 'POST',
      url: '/categories',
      failOnStatusCode: false,
      body: {
        name: 'Investigação',
      },
    }).then(response => {
      expect(response.status).equal(409);
    });
  });
});
