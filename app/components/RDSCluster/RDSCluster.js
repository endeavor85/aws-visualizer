import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSRDSIcon from 'react-aws-icons/dist/aws/logo/RDS';
import AWSVPCSubnetIcon from 'react-aws-icons/dist/aws/compute/VPCSubnet';

import styles from './RDSCluster.css';

type Props = {
  rdsCluster: {
    DBClusterIdentifier: string,
    DbClusterResourceId: string,
    AvailabilityZones: string[],
    DBSubnetGroup: string,
    Engine: string,
    EngineMode: string,
    Endpoint: string,
    Port: number,
    Status: string,
    VpcSecurityGroups: {
      VpcSecurityGroupId: string
    }[]
  },
  dbSubnetGroup: {
    DBSubnetGroupName: string,
    Subnets: {
      SubnetIdentifier: string
    }[]
  }
};

class RDSCluster extends Component<Props> {
  props: Props;

  render() {
    const { rdsCluster, dbSubnetGroup } = this.props;

    return (
      <div className={styles.RDSCluster}>
        <Panel id={rdsCluster.DBClusterIdentifier}>
          <Panel.Heading>
            <Panel.Toggle>
              <AWSRDSIcon className="awsIcon" />
            </Panel.Toggle>
            RDS Cluster {rdsCluster.DBClusterIdentifier} : <span className="code">{rdsCluster.DbClusterResourceId}</span>
          </Panel.Heading>
          <Panel.Collapse>
            <Table bordered condensed>
              <tbody>
                <tr>
                  <th>AZ</th>
                  <td>
                    <ul>
                      {rdsCluster.AvailabilityZones.map(az => (<li key={az}>{az}</li>))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>Engine</th>
                  <td>{rdsCluster.Engine}</td>
                </tr>
                <tr>
                  <th>Engine Mode</th>
                  <td>{rdsCluster.EngineMode}</td>
                </tr>
                <tr>
                  <th>Endpoint</th>
                  <td>{rdsCluster.Endpoint}</td>
                </tr>
                <tr>
                  <th>Port</th>
                  <td>{rdsCluster.Port}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{rdsCluster.Status}</td>
                </tr>
                <tr>
                  <th>VPC Security Groups</th>
                  <td>
                    <ul>
                      {rdsCluster.VpcSecurityGroups.map(vpcsg => (<li key={vpcsg.VpcSecurityGroupId}><a href={`#${vpcsg.VpcSecurityGroupId}`}>{vpcsg.VpcSecurityGroupId}</a></li>))}
                    </ul>
                    </td>
                </tr>
              </tbody>
            </Table>
            <Panel.Body>
              {dbSubnetGroup.Subnets.map(subnet => (
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

export default RDSCluster;
