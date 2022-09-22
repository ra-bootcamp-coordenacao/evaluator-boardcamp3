/// <reference types="cypress" />

describe('Obter cliente: obtenção', () => {
  it('Retorna o cliente no formato esperado?', () => {
    cy.getCustomer(0).then(customer => {

      cy.task('DATABASE', {
        dbConfig: Cypress.env('DB'),
        sql: `
        TRUNCATE TABLE "customers" RESTART IDENTITY;
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ('Thiago', 11999999999, 01123465789, '1995-02-23'),
        ('Maria', 11999999999, 01123465789, '1995-02-23');
        SELECT * FROM "customers" WHERE id=1;
        `,
      }).then((result) => {
        expect(result[2].rows[0].name).to.have.string("Thiago")
      });

      cy.request(`/customers/${customer.id}`).then(response => {
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('phone');
        expect(response.body).to.have.property('cpf');
        expect(response.body).to.have.property('birthday');
      });
    });
  });
});
