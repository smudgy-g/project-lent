import user from '../fixtures/user.json';
import item from '../fixtures/item.json'
import collections from '../fixtures/collection.json'

describe('Registration', () => {

  it('should register', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[name="username"]').type('Björn');
    cy.get('input[name="password"]').type('björn');
    cy.get('input[name="email"]').type('email@email.com');
    cy.get('input[name="streetName"]').type('Venloer Straße');
    cy.get('input[name="streetNumber"]').type('531');
    cy.get('input[name="postalCode"]').type('50825');
    cy.get('input[name="city"]').type('Köln');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/login');
  });

});

describe('Login', () => {

  it('should login with valid credentials', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('Klaus');
    cy.get('input[name="password"]').type('klaus');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
  });

});

describe('Load header & navigation', () => {

  it('the header & tab-navigation should be visible', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.header')
      .should('exist')
      .should('be.visible');
    cy.get('.tab-navigation')
      .should('exist')
      .should('be.visible');
  });

});

describe('Test header functionality', () => {

  it('should navigate to the correct files, shown in the dropdown menu', () => {
 
  });

});

describe('Load components completely & test navigation functionality', () => {

  it('should run through the collection components fluently and find all components in there', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.collection-overview')
      .should('exist')
      .should('be.visible');
    cy.get('.static-collection-preview').contains('All').click(); // Replace 'a' with the appropriate selector for your link
    cy.get('.static-collection-preview').contains('All').click(); // Replace 'a' with the appropriate selector for your link
  })

  it('should run through the discover components fluently and find all components in there', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.button').contains('Discover').click(); // Replace 'a' with the appropriate selector for your link
    cy.get('.search')
      .should('exist')
      .should('be.visible');
      cy.get('.collection-list')
      .should('exist')
      .should('be.visible');
  })

  it('should run through the addItem components fluently and find all components in there', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.button').contains('Add Item').click(); // Replace 'a' with the appropriate selector for your link
    cy.url().should('eq', 'http://localhost:3000/item/add'); // Replace with the expected URL of the new page
    cy.get('.camera-capture')
      .should('exist')
      .should('be.visible');
    cy.get('.button-group')
      .should('exist')
      .should('be.visible');
  })

  it('should run through the messaging component fluently and find all components in there', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.button').contains('Messages').click(); // Replace 'a' with the appropriate selector for your link
    cy.url().should('eq', 'http://localhost:3000/inbox'); // Replace with the expected URL of the new page
      cy.get('.chat-preview-container')
        .should('exist')
        .should('be.visible');
  })

  it('should run through the notifications component fluently and find all components in there', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('youUsername');
    cy.get('input[name="password"]').type('your-password');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.button').contains('Notifications').click(); // Replace 'a' with the appropriate selector for your link
      cy.get('.notifications-list')
        .should('exist')
        .should('be.visible');
      cy.get('.notifications-overlay')
        .should('exist')
        .should('be.visible');
  });

});

describe('Go from overview to a single item', () => {

  it('should find its way from overview to a single item', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('Klaus');
    cy.get('input[name="password"]').type('klaus');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.collection-overview')
      .should('exist')
      .should('be.visible');
    cy.get('.static-collection-preview').contains('All').click(); // Replace 'a' with the appropriate selector for your link
    cy.get('a').contains('Drill').click(); // Replace 'a' with the appropriate selector for your link
    cy.get('.image')
      .should('exist')
      .should('be.visible');
    cy.get('.information')
      .should('exist')
      .should('be.visible');
    cy.get('.button-group')
      .should('exist')
      .should('be.visible');
    cy.get('.status.reserved')
      .should('exist')
      .should('be.visible');
  });

})

describe('Search for an item', () => {

  it.only('should search and find an item correctly', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[name="username"]').type('Klaus');
    cy.get('input[name="password"]').type('klaus');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
      // Use cy.wait() to wait for any asynchronous operations that might affect the visibility of the element
    cy.wait(4000); // Adjust the wait time as needed
    cy.get('.collection-overview')
        .should('exist')
        .should('be.visible');
    cy.get('.button').contains('Discover').click(); // Replace 'a' with the appropriate selector for your link
    cy.get('input[type="search"]') // Select the search input field using the 'type="search"' attribute
      .type('Vacuum') // Replace 'Your search query' with the desired search term
      .type('{enter}'); // Presses the Enter key to trigger the search  })
    cy.get('.list-item-title')
      .find('h2') // Select the <h2> element within the list item container
      .should('exist')
      .should('be.visible')
      .should(($h2) => {
        const text = $h2.text().trim();
        expect(text).to.eq('Vacuum Cleaner');
      })
  })

})


// Header
// Lending Lifecycle
// Messages
// Notifications