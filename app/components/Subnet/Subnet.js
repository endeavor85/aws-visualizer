import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import Ec2Instance from '../Ec2Instance/Ec2Instance';

import styles from './Subnet.css';

class Subnet extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: props.subnet.Tags.find(tag => tag.Key === 'Name').Value
    };
  }

  render() {
    return (
      <div className={styles.Subnet}>
        <Panel header={`Subnet ${this.state.name} : ${this.props.subnet.SubnetId}`}>
          <span className={styles.SubnetCidr}>{this.props.subnet.CidrBlock}</span>
          <Table bordered condensed>
            <tbody>
              <tr><th>AZ</th><td>{this.props.subnet.AvailabilityZone}</td></tr>
              <tr><th>Default for AZ</th><td>{this.props.subnet.DefaultForAz.toString()}</td></tr>
              <tr><th>MapPublicIpOnLaunch</th><td>{this.props.subnet.MapPublicIpOnLaunch.toString()}</td></tr>
              <tr><th>AvailableIpAddressCount</th><td>{this.props.subnet.AvailableIpAddressCount}</td></tr>
              <tr><th>State</th><td>{this.props.subnet.State}</td></tr>
            </tbody>
          </Table>
          <h4>EC2 Instances</h4>
          {
            this.props.ec2Instances.length > 0 ? (
              this.props.ec2Instances.map(function(ec2Instance, i){
                return <Ec2Instance key={i} ec2Instance={ec2Instance} />
              })
            ) : (
              <span>None.</span>
            )
          }
        </Panel>
      </div>
    );
  }
}

export default Subnet;