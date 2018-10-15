import React from 'react';
import Register from '../../components/Register';
import { shallow } from 'enzyme';

describe("Renders Register component", () => {
    let wrapper;

    it("renders the form", () => {        
        wrapper = shallow(<Register />);         
        expect(wrapper.find('form').exists()).toBe(true);
    });  

    describe("when no fields are filled out", () => {

        beforeEach(() => {
            wrapper = shallow(<Register />);         
        });        

        it("does not render any warnings", () => {
            expect(wrapper.find(".error")).toHaveLength(0);
        });

        it("disables the Submit button", () => {
            expect(wrapper.find("button").get(0).props.disabled).toBe(true);       
        });
    });

    describe("when all fields are properly filled out", () => {

        it("does not render any warnings", () => {
            expect(wrapper.find(".error")).toHaveLength(0);
        });

        it("enables the Submit button", () => {
            wrapper.setState({
                firstName : "Joe",
                lastName : "Shmo",
                username : "JoeShmo",
                email : "Joe.Shmo@curly.com",
                password : "weakPass1!"                                                                
            });            
            expect(wrapper.find("button").get(0).props.disabled).toBe(false);       
        });
    });
    
});
