import React from 'react';
import Register from '../../components/Register';
import { shallow } from 'enzyme';
import configureStore from "redux-mock-store";

describe("Renders Register component", () => {
    const state = {
        auth: {

        }
    };
    const mockStore = configureStore();    
    let wrapper;
    beforeEach(() => {
       
    });  

    
    it('renders the form', () => {
        wrapper = shallow(<Register />);         
        console.log(wrapper);
        expect(wrapper.find('form').exists()).toBe(true);
    });  
});
