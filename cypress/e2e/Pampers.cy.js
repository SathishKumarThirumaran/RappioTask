
// 1. Navigate to 'https://www.pampers.com/en-us'
// 2. Click on Pampers Club
// 3. Perform a regsitration [ Child birth date should be a future date]
// 4. Perform a login with the created acc
// 5. Edit profile Update your First and Last name to John Doe

let uniqueString = ''; uniqueString = 'automation-' + Date.now().toString() + '@gmail.com';
const url = 'https://www.pampers.com/en-us';

describe('Pampers AccountCreation and ProfileUpdate', () => {
    it('AccountCreation', () => {
        cy.clearAllCookies();

        //1. launch the url
        cy.visit(url);
        cy.intercept('GET', 'https://script.crazyegg.com/pages/data-scripts/0025/9909/sampling/www.pampers.com.json?t=1').as('graphql');
       
        // 2. Click on Pampers Club
        cy.contains('Pampers Club').click()
        cy.title().should('contain', 'Register & log in to Pampers');

        // 3. Child birth date should be a future date
        cy.get('.date-field-calendar-icon').click();
        cy.get("[aria-selected='true']").next().click()

        cy.get("input[name='firstName']").should('be.visible').click().type('Name')
        cy.get("input[type='email']").should('be.visible').click().type(uniqueString)
        cy.get("input[placeholder='Phone Number']").should('be.visible').click().type('9930019109')
        cy.get("input[name='addressPostalCode']").should('be.visible').click().type('89009')
        cy.get("input[type='password']").should('be.visible').click().type('Test@1234')
        cy.get('.c-checkbox__input').first().click({ force: true });
        cy.get('.c-checkbox__input').last().click({ force: true });
        cy.get("button[title='Create your account']", { timeout: 5000 }).should('be.visible').click();
        cy.url().should('include', 'https://www.pampers.com/en-us/registration/thank-you-completed');
       

        cy.wait('@graphql', { timeout: 30000 }).then((interception) => { expect(interception.response?.statusCode).to.equal(200); });
        cy.get('[data-testid="span-link"]', { timeout: 30000 }).should('be.visible').click()

        // cy.get('[data-testid="span-link"]').should('exist').then((element) => {
        //     element[0].addEventListener('click', () => {
        //         console.log('[data-testid="span-link"]');
        //     });
     
        // });
    });
    it('ProfileUpdate', () => {

        cy.visit(url)
        cy.contains('profile icon').click();
        // cy.wait(5000);
        cy.get('[title="Login"]').click();
        cy.get('[name="signInEmailAddress"]').click().type('satz@gmail.com');
        cy.get('[type="password"]').click().type('Test@123');
        cy.contains('Connect to your account').click();
        cy.wait(5000)

        cy.get('.profile-cta_text', { timeout: 100000 }).should('be.visible').contains('My Profile').click();
        //Edite FirstName and LastName
        cy.get("input[name='firstName']").clear().type('John')
        cy.get("input[name='lastName']").clear().type('Doe')
        cy.get("button[title='Save changes']").click()
        cy.wait('@saveUserDataRequest').its('response.statusCode').should('eq', 200);
        cy.get("input[name='firstName']").should('have.value', 'John');
        cy.get("input[name='lastName']").should('have.value', 'Doe');




    });
});
