import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AwsIcon from '../AwsIcon/AwsIcon';

import styles from './Ec2Instance.css';

class Ec2Instance extends Component {
  render() {
    const name = this.props.ec2Instance.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.Ec2Instance}>
        <Panel header={`Ec2Instance ${name} : ${this.props.ec2Instance.InstanceId }`}>
          <AwsIcon src='Compute/Compute_AmazonEC2_instance' />
          <Table bordered condensed>
            <tbody>
              <tr><th>AZ</th><td>{this.props.ec2Instance.Placement.AvailabilityZone}</td></tr>
              <tr><th>Instance Type</th><td>{this.props.ec2Instance.InstanceType}</td></tr>
              <tr><th>Architecture</th><td>{this.props.ec2Instance.Architecture}</td></tr>
              <tr><th>State</th><td>{this.props.ec2Instance.State.Name}</td></tr>
              <tr><th>Launch Time</th><td>{this.props.ec2Instance.LaunchTime}</td></tr>
              <tr><th>Public IP</th>
                {
                  this.props.ec2Instance.PublicIpAddress ? (
                    <td>
                      <AwsIcon src='Compute/Compute_AmazonEC2_ElasticIPaddress' />
                      &nbsp;&nbsp;
                      {this.props.ec2Instance.PublicIpAddress}
                    </td>
                  ) : (
                    <td></td>
                  )
                }
              </tr>
              <tr><th>Public DNS Name</th><td>{this.props.ec2Instance.PublicDnsName}</td></tr>
              <tr><th>Private IP</th><td>{this.props.ec2Instance.PrivateIpAddress}</td></tr>
              <tr><th>Private DNS Name</th><td>{this.props.ec2Instance.PrivateDnsName}</td></tr>
              <tr><th>Key Name</th><td>{this.props.ec2Instance.KeyName}</td></tr>
              <tr><th>IAM Instance Profile</th><td>{this.props.ec2Instance.IamInstanceProfile.Arn}</td></tr>
              <tr><th>Image Id</th><td>{this.props.ec2Instance.ImageId}</td></tr>
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

export default Ec2Instance;
