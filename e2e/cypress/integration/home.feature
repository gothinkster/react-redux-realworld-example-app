Feature: Home login

This feature will test all functionalities related to ui login

@smoke
Scenario: Successfull UI login
    Given I visit the home page
    When  I sign in
    And I type user and password
    Then I should login