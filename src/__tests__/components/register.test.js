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

        beforeEach(() => {
            
            wrapper = shallow(<Register />);    
            wrapper.setState({
                "firstName" : "Joe",
                "firstName" : "Shmo",
                "firstName" : "JoeShmo",
                "firstName" : "Joe.Shmo@curly.com",
                "password" : "abcdefgh"                                                                
            });
        });

        it("does not render any warnings", () => {
            expect(wrapper.find(".error")).toHaveLength(0);
        });

        it("disables the Submit button", () => {
            expect(wrapper.find("button").get(0).props.disabled).toBe(false);       
        });
    });

});
