describe('admin happy path', () => {

    it('Register successfully', () => {
        cy.visit('localhost:3000/login');
        cy.url().should('include', 'localhost:3000/login')
        cy.get('[id="link-to-register"]').click()
        cy.url().should('include', 'register')
        //   cy.get('link[id="link-to-register"]').click()
        //   cy.url().should('include', 'register')
        cy.get('input[name="username"]')
            .focus()
            .type('testadmin')
        cy.get('input[name="email"]')
            .focus()
            .type('test12@admin.com')
        cy.get('input[name="password"]')
            .focus()
            .type('123456')
        cy.get('input[name="confirmPassword"]')
            .focus()
            .type('123456')
        cy.get('button[name="register-submit"]').click()
        cy.wait (1000)
        cy.url().should('include', 'localhost:3000/')
    })

    // it('login the application successfully', () => {
    //     cy.visit('localhost:3000/login');
    //     cy.get('input[name="email"]')
    //       .focus()
    //       .type('test9@admin.com')
    //     cy.get('input[name="password"]')
    //       .focus()
    //       .type('123456')
    //     cy.get('button[name="login-submit"]').click()
    //     cy.url().should('include', 'localhost:3000/')
    //   })

    it('Creates a new listing successfully', () => {
        cy.get('a[id="link-createListing"]').click()
        cy.url().should('include', 'createListing')
        cy.fixture('test.jpg', 'base64').then(fileContent => {
            cy.get('#uploadFile').attachFile({
                fileContent,
                fileName: 'test.jpg',
                mimeType: 'image/jpeg'
            });
        });

        cy.get('input[name="title"]')
            .focus()
            .type('new_listing_test')
        cy.get('[id="proporty-combobox"]').click()
        cy.get('li[data-value="Apartment"]').click()

        cy.get('input[name="price"]')
            .focus()
            .type('200')

        cy.get('input[name="country"]')
            .focus()
            .type('country1')

        cy.get('input[name="state"]')
            .focus()
            .type('state1')

        cy.get('input[name="city"]')
            .focus()
            .type('city1')

        cy.get('input[name="street"]')
            .focus()
            .type('street1')

        cy.get('input[name="postalCode"]')
            .focus()
            .type('postalCode1')

        cy.get('input[name="number"]')
            .focus()
            .type('2')

        // 使用 cy.fixture() 来加载一个图片文件
        cy.fixture('test.jpg', 'base64').then(fileContent => {
            // 模拟用户选择文件并触发上传事件
            cy.get('#setPropertyImages').attachFile({
                fileContent,
                fileName: 'test.jpg',
                mimeType: 'image/jpeg'
            });
        });

        cy.get('button[id="create-listing-btn"]').click()
        cy.url().should('include', 'hostedListing')

    })

    it('Edit listing successfully', () => {
        cy.get('svg[data-testid="EditIcon"]').first().click()
        cy.url().should('include', 'editListing')
        cy.fixture('test2.jpg', 'base64').then(fileContent => {
            cy.get('#uploadFile').attachFile({
                fileContent,
                fileName: 'test.jpg',
                mimeType: 'image/jpeg'
            });
        });

        cy.get('input[name="title"]')
            .focus()
            .type('title-edit')

        cy.get('button[id="edit-listing-btn"]').click()
        cy.url().should('include', 'hostedListing')
    })

    it('publish listing successfully', () => {
        cy.get('[id="publish-btn"]').first().click()

        cy.get('[placeholder="MM/DD/YYYY"]').first()
            .focus()
            .type('01')
            .type('40')
            .type('202023')

        cy.get('[placeholder="MM/DD/YYYY"]').eq(1)
            .focus()
            .type('01')
            .type('60')
            .type('202023')
        cy.get('button[id="confirm-publish"]').click()
        cy.url().should('include', 'hostedListing')
    })

    it('unpublish listing successfully', () => {
        cy.get('[id="unpublish-btn"]').first().click()
        cy.url().should('include', 'hostedListing')
    })

    it('publish listing successfully', () => {
        cy.get('[id="publish-btn"]').first().click()

        cy.get('[placeholder="MM/DD/YYYY"]').first()
            .focus()
            .type('01')
            .type('40')
            .type('202023')
        cy.get('[placeholder="MM/DD/YYYY"]').eq(1)
            .focus()
            .type('01')
            .type('60')
            .type('202023')
        cy.get('button[id="confirm-publish"]').click()
        cy.url().should('include', 'hostedListing')
    })

    it('Logs out of the application successfully', () => {
        cy.get('[id="logout-button"]').click()
        cy.url().should('include', 'localhost:3000')
    })

    it('Client Register successfully', () => {
        cy.visit('localhost:3000/login');
        cy.url().should('include', 'localhost:3000/login')
        cy.get('[id="link-to-register"]').click()
        cy.url().should('include', 'register')
        cy.get('input[name="username"]')
            .focus()
            .type('testadmin')
        cy.get('input[name="email"]')
            .focus()
            .type('test111@client.com')
        cy.get('input[name="password"]')
            .focus()
            .type('123456')
        cy.get('input[name="confirmPassword"]')
            .focus()
            .type('123456')
        cy.get('button[name="register-submit"]').click()
        cy.wait (1000)
        cy.url().should('include', 'localhost:3000/')
    })

    it('reserve listing successfully', () => {
        cy.visit('localhost:3000/');
        cy.get('[id="listing-more-link"]').first().click()

        cy.get('[placeholder="MM/DD/YYYY"]').first()
            .focus()
            .type('01')
            .type('40')
            .type('202023')

        cy.get('[placeholder="MM/DD/YYYY"]').eq(1)
            .focus()
            .type('01')
            .type('60')
            .type('202023')
        cy.get('button[id="book-btn"]').click()
        cy.get('button[id="confirm-book"]').click()
    })

    it('Logs out of the application successfully', () => {
        cy.get('[id="logout-button"]').click()
        cy.url().should('include', 'localhost:3000')
    })

    it('Login the application successfully', () => {
        cy.visit('localhost:3000/login');
        cy.get('input[name="email"]')
            .focus()
            .type('test12@admin.com')
        cy.get('input[name="password"]')
            .focus()
            .type('123456')
        cy.get('button[name="login-submit"]').click()
        cy.url().should('include', 'localhost:3000/')
    })

    it('Accept booking listing successfully', () => {
        cy.get('[id="link-hostedListing"]').click()
        cy.url().should('include', 'hostedListing')
        cy.get('button[id="show-more-btn"]').first().click()
        cy.url().should('include', 'showHostedListing')
        cy.get('button[id="accept-btn"]').first().click()

    })

    it('Logs out of the application successfully', () => {
        cy.get('[id="logout-button"]').click()
        cy.url().should('include', 'localhost:3000')
    })

    it('login the application successfully', () => {
        cy.visit('localhost:3000/login');
        cy.get('input[name="email"]')
            .focus()
            .type('test12@admin.com')
        cy.get('input[name="password"]')
            .focus()
            .type('123456')
        cy.get('button[name="login-submit"]').click()
        cy.url().should('include', 'localhost:3000/')
    })

})