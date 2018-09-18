import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';
import AWSVPCIcon from 'react-aws-icons/dist/aws/compute/VPC';

import Subnet from '../Subnet/Subnet';
import RDSInstance from '../RDSInstance/RDSInstance';
import RDSCluster from '../RDSCluster/RDSCluster';
import InternetGateway from '../InternetGateway/InternetGateway';

import styles from './Vpc.css';

type Props = {
  vpc: {
    VpcId: string,
    CidrBlock: string
  },
  subnets: {
    SubnetId: string
  }[],
  acls: {
    NetworkAclId: string,
    Associations: {
      SubnetId: string
    }[]
  }[],
  routeTables: {
    RouteTableId: string,
    Associations: {
      SubnetId: string | void
    }[]
  }[],
  internetGateways: {
    InternetGatewayId: string
  }[],
  rdsInstances: {
    DbiResourceId: string,
    DBSubnetGroup: {
      Subnets: {
        SubnetIdentifier: string
      }[]
    }
  }[],
  rdsClusters: {
    DBClusterIdentifier: string,
    DBSubnetGroup: string
  }[],
  dbSubnetGroups: {
    DBSubnetGroupName: string,
    Subnets: {
      SubnetIdentifier: string,
      SubnetAvailabilityZone: {
        Name: string
      }
    }[]
  }[],
  ec2Instances: {
    SubnetId: string
  }[],
  vpcEndpoints: {
    RouteTableIds: string[]
  }[]
};

class Vpc extends Component<Props> {
  props: Props;

  getSubnetEc2Instances = (ec2Instances, subnet) =>
    ec2Instances.filter(instance => instance.SubnetId === subnet.SubnetId);

  getSubnetRdsInstances = (rdsInstances, subnet) =>
    rdsInstances.filter(rdsInstance =>
      rdsInstance.DBSubnetGroup.Subnets
        .map(groupSubnet => groupSubnet.SubnetIdentifier)
        .includes(subnet.SubnetId)
    );

  getSubnetRdsClusters = (rdsClusters, dbSubnetGroups, subnet) =>
    rdsClusters.filter(rdsCluster =>
      this.getRdsClusterDbSubnetGroup(rdsCluster, dbSubnetGroups).Subnets
        .map(groupSubnet => groupSubnet.SubnetIdentifier)
        .includes(subnet.SubnetId)
    );

  // filter out VpcEndpoints not associated with any of the given RouteTables
  getRouteTablesVpcEndpoints = (vpcEndpoints, routeTables) => {
    const routeTableIds = routeTables.map((routeTable) => routeTable.RouteTableId);
    return vpcEndpoints.filter(
      vpcEndpoint =>
        vpcEndpoint.RouteTableIds.filter(
          routeTableId => routeTableIds.includes(routeTableId)
        ).length > 0
    );
  }
  
  getSubnetNetworkACLs = (acls, subnet) =>
    acls.filter(
      acl =>
        acl.Associations.filter(
          association => association.SubnetId === subnet.SubnetId
        ).length > 0
    );
  
  getSubnetRouteTables = (routeTables, subnet) =>
    routeTables.filter(
      routeTable =>
      routeTable.Associations.filter(
          association => association.SubnetId === subnet.SubnetId
        ).length > 0
    );
  
  getRdsClusterDbSubnetGroup = (rdsCluster, dbSubnetGroups) =>
    dbSubnetGroups.find(
      dbSubnetGroup => dbSubnetGroup.DBSubnetGroupName === rdsCluster.DBSubnetGroup
    );

  render() {
    const {
      vpc,
      subnets,
      acls,
      routeTables,
      internetGateways,
      rdsInstances,
      rdsClusters,
      dbSubnetGroups,
      ec2Instances,
      vpcEndpoints
    } = this.props;

    const name = vpc.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.Vpc}>
        <Panel>
          <Panel.Heading>
            <Panel.Toggle><AWSVPCIcon className="awsIcon" /></Panel.Toggle>
            VPC {name} : <span className="code">{vpc.VpcId}</span>
          </Panel.Heading>
          <Table bordered condensed>
            <tbody>
              <tr>
                <th>CIDR</th>
                <td>{vpc.CidrBlock}</td>
              </tr>
            </tbody>
          </Table>
          <Panel.Collapse>
            <Panel.Body>
              {subnets.map(subnet => (
                <Subnet
                  key={subnet.SubnetId}
                  subnet={subnet}
                  acls={this.getSubnetNetworkACLs(acls, subnet)}
                  routeTables={this.getSubnetRouteTables(routeTables, subnet)}
                  // get the vpcEndpoints associated with any of the route tables associated with this subnet
                  vpcEndpoints={this.getRouteTablesVpcEndpoints(
                    vpcEndpoints,
                    this.getSubnetRouteTables(routeTables, subnet)
                  )}
                  ec2Instances={this.getSubnetEc2Instances(ec2Instances, subnet)}
                  rdsInstances={this.getSubnetRdsInstances(rdsInstances, subnet)}
                  rdsClusters={this.getSubnetRdsClusters(rdsClusters, dbSubnetGroups, subnet)}
                />
              ))}
              {internetGateways.length > 0 ? (
                internetGateways.map(igw => (
                  <InternetGateway
                    key={igw.InternetGatewayId}
                    internetGateway={igw}
                  />
                ))
              ) : (
                <h4>No Internet Gateways.</h4>
              )}
              {rdsInstances.length > 0 ? (
                rdsInstances.map(rdsInstance => (
                  <RDSInstance
                    key={rdsInstance.DbiResourceId}
                    rdsInstance={rdsInstance}
                  />
                ))
              ) : (
                <h4>No RDS Instances.</h4>
              )}
              {rdsClusters.length > 0 ? (
                rdsClusters.map(rdsCluster => (
                  <RDSCluster
                    key={rdsCluster.DBClusterIdentifier}
                    rdsCluster={rdsCluster}
                    dbSubnetGroup={this.getRdsClusterDbSubnetGroup(rdsCluster, dbSubnetGroups)}
                  />
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

export default Vpc;
