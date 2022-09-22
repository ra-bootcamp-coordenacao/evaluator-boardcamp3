/// <reference types="cypress" />

describe('Inserir cliente: status code', () => {
  it('Retorna 201 no sucesso?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      `,
    }).then((result) => {});
    
    cy.request('POST', '/customers', {
      name: 'Ana',
      phone: '21888888888',
      cpf: '21222222222',
      birthday: '1995-02-23',
    }).then(response => {
      expect(response.status).equal(201);
    });
  });

  it('Retorna 400 quando a validação básica falha? - name inválido', () => {
    cy.request({
      method: 'POST',
      url: '/customers',
      failOnStatusCode: false,
      body: {
        name: '',
        phone: '88888888888',
        cpf: '21322222222',
        birthday: '1995-02-23',
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - cpf inválido', () => {
    cy.request({
      method: 'POST',
      url: '/customers',
      failOnStatusCode: false,
      body: {
        name: 'João',
        phone: '88888888888',
        cpf: '2134222222',
        birthday: '1995-02-23',
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - phone inválido', () => {
    cy.request({
      method: 'POST',
      url: '/customers',
      failOnStatusCode: false,
      body: {
        name: 'João',
        phone: '8888888888888',
        cpf: '21342222222',
        birthday: '1995-02-23',
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - birthday inválido', () => {
    cy.request({
      method: 'POST',
      url: '/customers',
      failOnStatusCode: false,
      body: {
        name: 'João',
        phone: '88888888888',
        cpf: '21342222222',
        birthday: '',
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 409 quando já existe um cliente com mesmo cpf?', () => {

    cy.task('DATABASE', {

      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Joana', 88888888888, 21222222222, '1995-02-23')
      `,
    }).then((result) => {});

    cy.request({
      method: 'POST',
      url: '/customers',
      failOnStatusCode: false,
      body: {
        name: 'Joana',
        phone: '88888888888',
        cpf: '21222222222',
        birthday: '1995-02-23',
      },
    }).then(response => {
      expect(response.status).equal(409);
    });
  });
});
