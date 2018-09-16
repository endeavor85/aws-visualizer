import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AwsIcon from '../AwsIcon/AwsIcon';

import styles from './RDSInstance.css';

class RDSInstance extends Component {
  render() {
    return (
      <div className={styles.RDSInstance}>
        <Panel header={`RDSInstance ${this.props.rdsInstance.DBInstanceIdentifier} : ${this.props.rdsInstance.DbiResourceId }`}>
          <AwsIcon src='Database/Database_AmazonRDS' />
          <Table bordered condensed>
            <tbody>
              <tr><th>AZ</th><td>{this.props.rdsInstance.AvailabilityZone}</td></tr>
              <tr><th>Instance Class</th><td>{this.props.rdsInstance.DBInstanceClass}</td></tr>
              <tr><th>Engine</th><td>{this.props.rdsInstance.Engine}</td></tr>
              <tr><th>Address</th><td>{this.props.rdsInstance.Endpoint.Address}</td></tr>
              <tr><th>Port</th><td>{this.props.rdsInstance.Endpoint.Port}</td></tr>
              <tr><th>Instance Status</th><td>{this.props.rdsInstance.DBInstanceStatus}</td></tr>
              <tr><th>Publicly Accessible</th><td>{this.props.rdsInstance.PubliclyAccessible ? "Yes" : "No"}</td></tr>
            </tbody>
          </Table>
          <h4>VPC Subnets</h4>
          {
            this.props.rdsInstance.DBSubnetGroup.Subnets.map((subnet, i) => {
              return <div key={i}>{subnet.SubnetIdentifier}</div>
            })
          }
        </Panel>
      </div>
    );
  }
}

export default RDSInstance;
