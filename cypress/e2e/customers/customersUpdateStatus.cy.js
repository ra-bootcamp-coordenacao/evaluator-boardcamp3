/// <reference types="cypress" />

describe('Atualizar cliente: status code', () => {
  it('Retorna 200 no sucesso?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Maria', 11999999999, 11111111111, '1995-02-23');
      SELECT * FROM "customers";
      `,
    }).then(result => {});

    cy.getCustomer(0).then(customer => {
      cy.request('PUT', `/customers/${customer.id}`, {
        cpf: '48596324789',
        phone: customer.phone,
        birthday: customer.birthday,
        name: 'Ana',
      }).then(response => {
        expect(response.status).equal(200);
      });
    });
  });

  it('Retorna 400 quando a validação básica falha? - name inválido', () => {
    cy.getCustomer(0).then(customer => {
      cy.request({
        method: 'PUT',
        url: `/customers/${customer.id}`,
        failOnStatusCode: false,
        body: {
          ...customer,
          name: '',
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 quando a validação básica falha? - cpf inválido', () => {
    cy.getCustomer(0).then(customer => {
      cy.request({
        method: 'PUT',
        url: `/customers/${customer.id}`,
        failOnStatusCode: false,
        body: {
          ...customer,
          cpf: '3333333333',
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 quando a validação básica falha? - phone inválido', () => {
    cy.getCustomer(0).then(customer => {
      cy.request({
        method: 'PUT',
        url: `/customers/${customer.id}`,
        failOnStatusCode: false,
        body: {
          ...customer,
          phone: '999999999999',
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 400 quando a validação básica falha? - birthday inválido', () => {
    cy.getCustomer(0).then(customer => {
      cy.request({
        method: 'PUT',
        url: `/customers/${customer.id}`,
        failOnStatusCode: false,
        body: {
          ...customer,
          birthday: '210005-24',
        },
      }).then(response => {
        expect(response.status).equal(400);
      });
    });
  });

  it('Retorna 409 quando já existe um cliente com mesmo cpf?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "customers" RESTART IDENTITY;
      INSERT INTO customers (name, phone, cpf, birthday) 
      VALUES ('Thiago', 11999999999, 22222222222, '1995-02-23');
      SELECT * FROM "customers";
      `,
    }).then(result => {});

    cy.getCustomer(0).then(customer => {
      cy.request({
        method: 'PUT',
        url: `/customers/${customer.id}`,
        failOnStatusCode: false,
        body: {
          cpf: '22222222222',
          phone: customer.phone,
          birthday: customer.birthday,
          name: 'Ana',
        },
      }).then(response => {
        expect(response.status).equal(409);
      });
    });
  });
});
