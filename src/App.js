import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// replace this with the client_id of your fortellis app
const client_id = 'placeholder-client-id';

// the subscriptionId represents the dealership context of an API call
// in this example, we call the merchandisable vehicles API to get the vehicles available for sale in a given dealership
// the subscriptionId represents which dealership we are talking about
// 'test' is a special subscriptionId that represents a sample dealership that provides test data
// when a dealership customer purchases and uses your app, you will need to use their subscriptionId in your API calls
const subscriptionId = 'test';

let token;

class App extends Component {

  constructor() {
    super();
    this.getMerchandisableVehicles = this.getMerchandisableVehicles.bind(this);
    this.state = {
      loading: false,
      vehicles: []
    }
  }

  getMerchandisableVehicles() {
    // set the loading state in case the API call is slow
    this.setState({loading: true});

    // make an API call to a fortellis API
    // supply the previously acquired token in the Authorization header
    fetch('https://api.fortellis.io/sales/inventory/v0/merchandisable-vehicles/', {
        headers: {
          'subscriptionId': subscriptionId,
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        return response.json();
      }).then((json) => {
        if (json.items) {
          this.setState({vehicles: json.items, loading: false});
        }
      }).catch((err) => {
        this.setState({loading: false});
        alert('API call failed! Error: ' + err);
      });
  }
  
  componentWillMount() {
    // if the URL contains a token, grab it and hide it from the user
    token =
      window.location.href.match(/access_token=(.*?)&/) &&
      window.location.href.match(/access_token=(.*?)&/)[1];
  
    window.history.replaceState("", document.title, window.location.pathname + window.location.search);
  }
  
  getContent() {
    if (this.state.loading) {
      return (
        <p>Loading...</p>
      )
    }
    else if (this.state.vehicles.length > 0) {
      // display results of API call
      return (
        <table align="center" cellspacing="25">
          {this.state.vehicles.map((row, index) => {
            return (
              <tr>
                <td><img src={row.merchandisingSummary.mainPhoto.path} height="200" width="300" alt="vehicle"/></td>
                <td>{row.vehicle.description.description}</td>
                <td>{row.merchandisingSummary.price.netPrice}{row.merchandisingSummary.price.currencyCode}</td>
              </tr>
            )
          })}
        </table>
      )
  
    }
    else if (token) {
      // button to make API call
      return (
        <button onClick={this.getMerchandisableVehicles}>
          Get Vehicles
        </button>
      )
    }
    else {
      // login link to get access token
      return (
        <a href={`https://api.fortellis.io/oauth/authorize?response_type=token&client_id=${client_id}`}>
          Login with Fortellis
        </a>
      )
    }
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Vehicle Finder</h1>
        </header>
        <br/>
        {this.getContent()}
      </div>
    );
  }
}

export default App;
