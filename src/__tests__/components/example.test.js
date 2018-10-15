import React from 'react';
import Register from '../../components/Register';
import { shallow } from 'enzyme';
import configureStore from "redux-mock-store";

describe("Renders Register component", () => {
    const mockStore = configureStore();    
    let wrapper;
    
    it('renders the form', () => {
        const wrapper = shallow(<Register />);         
        expect(wrapper.find('form').exists()).toBe(true);
    });  
});
