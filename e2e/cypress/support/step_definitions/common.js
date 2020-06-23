import { Given, When, Then, Before, After } from "cypress-cucumber-preprocessor/steps";
import '../index'
import UserAPi from '../../integration/_apis/userApi'

const userApi = new UserAPi();

Given(/^I am an authenticated user$/, () => {
    // userApi.userLogin();    
});