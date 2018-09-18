// @flow
import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Panel, Col } from 'react-bootstrap';

import AwsVisualizer from '../components/AwsVisualizer';

const electron = window.require('electron');
const { ipcRenderer } = electron;

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
    const { target } = event;
    const { value, name } = target;

    this.setState({
      [name]: value
    });
  }

  loadAwsData = () => {
    const {
      awsRegion,
      awsProfile
    } = this.state;

    console.log("Loading AWS Data...");

    ipcRenderer.send('load-aws-data', {
      awsRegion,
      awsProfile
    });
  }
  
  render() {
    const {
      awsData,
      awsRegion,
      awsProfile
    } = this.state;

    return (
      <div>
        <br/>
        {
          !awsData &&
          
          <div className="container">
            <Panel>
              <Panel.Heading>
                <Panel.Title>Load AWS Data</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                AWS data not loaded.
              </Panel.Body>
              <Form horizontal>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    AWS Region
                  </Col>
                  <Col sm={10}>
                    <FormControl
                      name="awsRegion"
                      type="text"
                      value={awsRegion}
                      placeholder="Region"
                      onChange={this.handleInputChange}
                    />
                    <HelpBlock>Validation is based on string length.</HelpBlock>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    AWS Profile
                  </Col>
                  <Col sm={10}>
                    <FormControl
                      name="awsProfile"
                      type="text"
                      value={awsProfile}
                      placeholder="Profile"
                      onChange={this.handleInputChange}
                    />
                    <HelpBlock>Validation is based on string length.</HelpBlock>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Button
                      bsStyle="primary"
                      onClick={this.loadAwsData} >
                      Load AWS Data
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Panel>
          </div>
        }
        {
          awsData &&
          <div className="container-fluid">
            <AwsVisualizer
              awsRegion={awsRegion}
              awsData={awsData} />
          </div>
        }
      </div>
    );
  }
}
