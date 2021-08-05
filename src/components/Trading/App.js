import React, { Component } from 'react';
import Cards from './Components/Cards';
import Decks from './Components/Decks'

class App extends Component {
  state = {
    DataList: []
  };

  async componentDidMount() {
    this.getData();
  }
  getData = async () => {
    const apiUrl = "https://raw.githubusercontent.com/Gayathri-p32/DeckData/main/Data.json"
    const response = await fetch(apiUrl);
    const data = await response.json();
    this.setState({
      DataList: data
    });
  }
  render() {
    const DeckData = this.state.DataList;
    return (
      <div className="App">
        <Cards decks={DeckData} />
        
      </div>
    );
  }
}

export default App;
