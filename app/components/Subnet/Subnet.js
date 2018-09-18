import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSVPCSubnetIcon from 'react-aws-icons/dist/aws/compute/VPCSubnet';
import AWSRDSIcon from 'react-aws-icons/dist/aws/logo/RDS';

import NetworkAcl from '../NetworkAcl/NetworkAcl';
import RouteTable from '../RouteTable/RouteTable';
import Ec2Instance from '../Ec2Instance/Ec2Instance';

import styles from './Subnet.css';

type Props = {
  subnet: {
    SubnetId: string,
    CidrBlock: string,
    AvailabilityZone: string,
    DefaultForAz: boolean,
    MapPublicIpOnLaunch: boolean,
    AvailableIpAddressCount: number,
    State: string,
    Tags: {
      Key: string,
      Value: string
    }[]
  },
  ec2Instances: {
    InstanceId: string
  }[],
  rdsInstances: {
    DBInstanceIdentifier: string
  }[],
  rdsClusters: {
    DBClusterIdentifier: string
  }[],
  acls: {
    NetworkAclId: string
  }[],
  routeTables: {
    RouteTableId: string
  }[],
  vpcEndpoints: {
    VpcEndpointId: string
  }[]
};

class Subnet extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      name: props.subnet.Tags.find(tag => tag.Key === 'Name').Value
    };
  }

  render() {
    const { subnet, acls, routeTables, ec2Instances, rdsInstances, rdsClusters, vpcEndpoints } = this.props;

    const { name } = this.state;

    return (
      <div className={styles.Subnet}>
        <Panel id={subnet.SubnetId}>
          <Panel.Heading>
            <Panel.Toggle><AWSVPCSubnetIcon className="awsIcon" /></Panel.Toggle>
            Subnet {name} : <span className="code">{subnet.SubnetId}</span>
          </Panel.Heading>
            <Panel.Collapse>
            <Table bordered condensed>
              <tbody>
                <tr>
                  <th>CIDR</th>
                  <td>{subnet.CidrBlock}</td>
                </tr>
                <tr>
                  <th>AZ</th>
                  <td>{subnet.AvailabilityZone}</td>
                </tr>
                <tr>
                  <th>Default for AZ</th>
                  <td>{subnet.DefaultForAz.toString()}</td>
                </tr>
                <tr>
                  <th>MapPublicIpOnLaunch</th>
                  <td>{subnet.MapPublicIpOnLaunch.toString()}</td>
                </tr>
                <tr>
                  <th>AvailableIpAddressCount</th>
                  <td>{subnet.AvailableIpAddressCount}</td>
                </tr>
                <tr>
                  <th>State</th>
                  <td>{subnet.State}</td>
                </tr>
              </tbody>
            </Table>
            <Panel.Body>
              {acls.length > 0 ? (
                acls.map(acl => (
                  <NetworkAcl
                    key={acl.NetworkAclId}
                    acl={acl}
                  />
                ))
              ) : (
                <h4>No Network ACLs.</h4>
              )}
              {routeTables.length > 0 ? (
                routeTables.map(routeTable => (
                  <RouteTable
                    key={routeTable.RouteTableId}
                    routeTable={routeTable}
                    vpcEndpoints={vpcEndpoints}
                  />
                ))
              ) : (
                <h4>No explicit Route Table, using default.</h4>
              )}
              {ec2Instances.length > 0 ? (
                ec2Instances.map(ec2Instance => (
                  <Ec2Instance
                    key={ec2Instance.InstanceId}
                    ec2Instance={ec2Instance}
                  />
                ))
              ) : (
                <h4>No EC2 Instances.</h4>
              )}
              {rdsInstances.length > 0 ? (
                rdsInstances.map(rdsInstance => (
                  <div key={rdsInstance.DBInstanceIdentifier} className={styles.Brief}>
                    <a href={`#${rdsInstance.DBInstanceIdentifier}`}>
                      <AWSRDSIcon className="awsIcon" size={64} />
                    </a>
                    (TODO: add a shortcut image on this icon to indicate that it is defined elsewhere)
                    <div className="caption">
                      <h4>RDS Instance</h4>
                      <h4>{rdsInstance.DBInstanceIdentifier}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <h4>No RDS Instances.</h4>
              )}
              {rdsClusters.length > 0 ? (
                rdsClusters.map(rdsCluster => (
                  <div key={rdsCluster.DBClusterIdentifier} className={styles.Brief}>
                    <a href={`#${rdsCluster.DBClusterIdentifier}`}>
                      <AWSRDSIcon className="awsIcon" size={64} />
                    </a>
                    (TODO: add a shortcut image on this icon to indicate that it is defined elsewhere)
                    <div className="caption">
                      <h4>RDS Cluster</h4>
                      <h4>{rdsCluster.DBClusterIdentifier}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <h4>No RDS Clusters.</h4>
              )}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}

export default Subnet;
