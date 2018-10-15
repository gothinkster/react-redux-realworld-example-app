import React from 'react';
import Register from '../../components/Register';

import { shallow } from 'enzyme';
import configureStore from "redux-mock-store";
import agent from "../../agent";

describe("Renders Register component", () => {
    const state = {
        auth: {

        }
    };
    const mockStore = configureStore();    
    let wrapper;
    let store;

    beforeEach(() => {

    });  

    
    it('renders the form', (state) => {
        store=mockStore(state, agent);
        wrapper = shallow(<Register store={store} />);        
        expect(wrapper.find('form').exists()).to.equal(true);
    });  
});
