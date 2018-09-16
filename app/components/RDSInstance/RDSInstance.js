import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSRDSIcon from 'react-aws-icons/dist/aws/logo/RDS';

import styles from './RDSInstance.css';

type Props = {
  rdsInstance: {
    DBInstanceIdentifier: string,
    DbiResourceId: string,
    AvailabilityZone: string,
    DBInstanceClass: string,
    Engine: string,
    Endpoint: {
      Address: string,
      Port: number
    },
    DBInstanceStatus: string,
    PubliclyAccessible: boolean,
    DBSubnetGroup: {
      Subnets: {
        SubnetIdentifier: string
      }[]
    }
  }
};

class RDSInstance extends Component<Props> {
  props: Props;

  render() {
    const { rdsInstance } = this.props;

    return (
      <div className={styles.RDSInstance}>
        <Panel
          header={`RDSInstance ${rdsInstance.DBInstanceIdentifier} : ${
            rdsInstance.DbiResourceId
          }`}
        >
          <AWSRDSIcon className="awsIcon" size={64} />
          <Table bordered condensed>
            <tbody>
              <tr>
                <th>AZ</th>
                <td>{rdsInstance.AvailabilityZone}</td>
              </tr>
              <tr>
                <th>Instance Class</th>
                <td>{rdsInstance.DBInstanceClass}</td>
              </tr>
              <tr>
                <th>Engine</th>
                <td>{rdsInstance.Engine}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{rdsInstance.Endpoint.Address}</td>
              </tr>
              <tr>
                <th>Port</th>
                <td>{rdsInstance.Endpoint.Port}</td>
              </tr>
              <tr>
                <th>Instance Status</th>
                <td>{rdsInstance.DBInstanceStatus}</td>
              </tr>
              <tr>
                <th>Publicly Accessible</th>
                <td>{rdsInstance.PubliclyAccessible ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </Table>
          <h4>VPC Subnets</h4>
          {rdsInstance.DBSubnetGroup.Subnets.map(subnet => (
            <div key={subnet.SubnetIdentifier}>{subnet.SubnetIdentifier}</div>
          ))}
        </Panel>
      </div>
    );
  }
}

export default RDSInstance;
