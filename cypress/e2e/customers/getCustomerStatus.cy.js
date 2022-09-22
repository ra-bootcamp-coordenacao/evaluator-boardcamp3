/// <reference types="cypress" />

describe('Obter cliente: status code', () => {
  it('Retorna 404 caso não encontrado?', () => {
    cy.request({
      method: 'GET',
      url: '/customers/0',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).equal(404);
    });
  });
});
