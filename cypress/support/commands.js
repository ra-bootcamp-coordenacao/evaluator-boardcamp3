Cypress.Commands.add('insertCategory', name => {
  cy.request('POST', '/categories', { name });
});

Cypress.Commands.add('insertCustomer', (name, cpf) => {
  cy.request('POST', '/customers', {
    name,
    phone: '21998899222',
    cpf,
    birthday: '1992-10-05',
  });
});

Cypress.Commands.add('getCategory', index => {
  return cy.request('/categories').then(response => {
    const category = response.body[index];
    return category;
  });
});

Cypress.Commands.add('getCustomer', index => {
  return cy.request('/customers').then(response => {
    const customer = response.body[index];
    return customer;
  });
});

Cypress.Commands.add('getGame', index => {
  return cy.request('/games').then(response => {
    const game = response.body[index];
    return game;
  });
});

Cypress.Commands.add('getGameAndCustomer', (gameIndex, customerIndex) => {
  return cy.request('/games').then(response => {
    const game = response.body[gameIndex];
    return cy.request('/customers').then(response => {
      const customer = response.body[customerIndex];
      return { game, customer };
    });
  });
});

Cypress.Commands.add('insertGame', name => {
  return cy.request('/categories').then(response => {
    const categoryId = response.body[0].id;
    return cy
      .request('POST', '/games', {
        name: name,
        image: 'https://github.com/teste.jpg',
        stockTotal: 1,
        categoryId: categoryId,
        pricePerDay: 200,
      })
      .then(() => {
        return cy.request('/games').then(response => {
          const game = response.body.find(game => game.name === name);
          return game;
        });
      });
  });
});

Cypress.Commands.add('insertRental', gameName => {
  return cy.insertGame(gameName).then(game => {
    return cy.getCustomer(0).then(customer => {
      return cy
        .request('POST', '/rentals', {
          customerId: customer.id,
          gameId: game.id,
          daysRented: 2,
        })
        .then(() => {
          const obj = {
            game,
            customer,
          };

          return obj;
        });
    });
  });
});
