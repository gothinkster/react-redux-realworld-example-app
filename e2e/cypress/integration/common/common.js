import { Given, When, Then, Before, After } from "cypress-cucumber-preprocessor/steps";
import '../../support/index'

import UserAPi from '../apis/userApi'

const userApi = new UserAPi();

Given(/^I am an authenticated user$/, () => {
    
    userApi.userLogin('jprealini@gmail.com', 'jppooh74');
});