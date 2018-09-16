// @flow
import React, { Component } from 'react';
import AwsVisualizer from '../components/AwsVisualizer';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

export default class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      awsRegion: 'us-east-1',
      awsProfile: 'aquilats',
      awsData: null
    }

    ipcRenderer.removeAllListeners('aws-data-response');
    ipcRenderer.on('aws-data-response', (event, data) => {
      console.log("AWS data loaded.");

      this.setState({awsData: data});
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  loadAwsData = () => {
    console.log("Loading AWS Data...");

    ipcRenderer.send('load-aws-data', {
      awsRegion: this.state.awsRegion,
      awsProfile: this.state.awsProfile
    });
  }
  
  render() {
    return (
      <div>
        {
          !this.state.awsData &&
          <div>
            <p>
              AWS data not loaded.
            </p>
            <input
              name="awsRegion"
              type="text"
              placeholder="Region"
              defaultValue={this.state.awsRegion}
              onChange={this.handleInputChange} />
            <input
              type="text"
              placeholder="Profile"
              defaultValue={this.state.awsProfile}
              onChange={this.handleInputChange} />
            <button onClick={this.loadAwsData}>Load AWS Data</button>
          </div>
        }
        {
          this.state.awsData &&
          <AwsVisualizer
            awsRegion={this.state.awsRegion}
            awsData={this.state.awsData} />
        }
      </div>
    );
  }
}
