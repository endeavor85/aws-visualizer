import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSRDSIcon from 'react-aws-icons/dist/aws/logo/RDS';
import AWSVPCSubnetIcon from 'react-aws-icons/dist/aws/compute/VPCSubnet';

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
        <Panel id={rdsInstance.DBInstanceIdentifier}>
          <Panel.Heading>
            <Panel.Toggle>
              <AWSRDSIcon className="awsIcon" />
            </Panel.Toggle>
            RDS Instance {rdsInstance.DBInstanceIdentifier} : <span className="code">{rdsInstance.DbiResourceId}</span>
          </Panel.Heading>
          <Panel.Collapse>
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
            <Panel.Body>
              {rdsInstance.DBSubnetGroup.Subnets.map(subnet => (
                <div key={subnet.SubnetIdentifier}>
                  <AWSVPCSubnetIcon className="awsIcon" />
                  <a href={`#${subnet.SubnetIdentifier}`}>{subnet.SubnetIdentifier}</a>
                </div>
              ))}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}

export default RDSInstance;
