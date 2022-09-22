/// <reference types="cypress" />

describe('Inserir jogo: status code', () => {
  it('Retorna 201 no sucesso?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      `,
    }).then(result => {});

    cy.request('POST', '/games', {
      name: 'Detetive',
      image: 'https://github.com/teste.jpg',
      stockTotal: 5,
      categoryId: 1,
      pricePerDay: 150,
    }).then(response => {
      expect(response.status).equal(201);
    });
  });

  it('Retorna 400 quando a validação básica falha? - category inválido', () => {
    cy.request({
      method: 'POST',
      url: '/games',
      failOnStatusCode: false,
      body: {
        name: 'Academia',
        image: 'https://github.com/teste.jpg',
        stockTotal: 4,
        categoryId: 0,
        pricePerDay: 150,
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - stockTotal inválido', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      `,
    }).then(result => {});

    cy.request({
      method: 'POST',
      url: '/games',
      failOnStatusCode: false,
      body: {
        name: 'Imagem e Ação',
        image: 'https://github.com/teste.jpg',
        stockTotal: 0,
        categoryId: 1,
        pricePerDay: 150,
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - pricePerDay inválido', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      `,
    }).then(result => {});

    cy.request({
      method: 'POST',
      url: '/games',
      failOnStatusCode: false,
      body: {
        name: 'Cara a Cara',
        image: 'https://github.com/teste.jpg',
        stockTotal: 5,
        categoryId: 1,
        pricePerDay: 0,
      },
    }).then(response => {
      expect(response.status).equal(400);
    });
  });

  it('Retorna 400 quando a validação básica falha? - name inválido', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      `,
    }).then(result => {});

    cy.request({
      method: 'POST',
      url: '/games',
      failOnStatusCode: false,
      body: {
        name: '',
        image: 'https://github.com/teste.jpg',
        stockTotal: 5,
        categoryId: 1,
        pricePerDay: 150,
      },
    });
  });

  it('Retorna 409 quando já existe um jogo com o mesmo nome?', () => {
    cy.task('DATABASE', {
      dbConfig: Cypress.env('DB'),
      sql: `
      TRUNCATE TABLE "games" RESTART IDENTITY;
      TRUNCATE TABLE "categories" RESTART IDENTITY;

      INSERT INTO "categories" (name) 
      VALUES ('Investigação'), ('Ação');

      INSERT INTO games
      (name, image,"stockTotal", "categoryId", "pricePerDay") 
      VALUES 
      ('Detetive', 'https://github.com/teste.jpg', 5, 1, 150);
      `,
    });

    cy.getCategory(0).then(category => {
      cy.request({
        method: 'POST',
        url: '/games',
        failOnStatusCode: false,
        body: {
          name: 'Detetive',
          image: 'https://github.com/teste.jpg',
          stockTotal: 5,
          categoryId: category.id,
          pricePerDay: 150,
        },
      }).then(response => {
        expect(response.status).equal(409);
      });
    });
  });
});
