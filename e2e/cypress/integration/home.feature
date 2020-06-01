Feature: Home login

    This feature will test all functionalities related to ui login

    @ignore
    Scenario: Successfull UI login
        Given I visit the home page
        When  I sign in
        And I type user and password
        Then I should login

    @smoke
    Scenario: Create new post
        Given I am an authenticated user
        When I create a new post
        Then I should see the new post page