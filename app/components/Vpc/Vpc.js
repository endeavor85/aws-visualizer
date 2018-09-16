import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import AWSVPCIcon from 'react-aws-icons/dist/aws/compute/VPC';

import Subnet from '../Subnet/Subnet';
import NetworkAcl from '../NetworkAcl/NetworkAcl';
import RouteTable from '../RouteTable/RouteTable';
import RDSInstance from '../RDSInstance/RDSInstance';
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
    NetworkAclId: string
  }[],
  routeTables: {
    RouteTableId: string
  }[],
  internetGateways: {
    InternetGatewayId: string
  }[],
  rdsInstances: {
    DbiResourceId: string
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

  getRouteTableVpcEndpoints = (vpcEndpoints, routeTable) =>
    vpcEndpoints.filter(
      vpcEndpoint =>
        vpcEndpoint.RouteTableIds.filter(
          routeTableId => routeTableId === routeTable.RouteTableId
        ).length > 0
    );

  render() {
    const {
      vpc,
      subnets,
      acls,
      routeTables,
      internetGateways,
      rdsInstances,
      ec2Instances,
      vpcEndpoints
    } = this.props;

    const name = vpc.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.Vpc}>
        <Panel header={`VPC ${name} : ${vpc.VpcId}`}>
          <AWSVPCIcon className="awsIcon" size={64} />
          <span className={styles.VpcCidr}>{vpc.CidrBlock}</span>
          <h3>Subnets</h3>
          {subnets.map(subnet => (
            <Subnet
              key={subnet.SubnetId}
              subnet={subnet}
              ec2Instances={this.getSubnetEc2Instances(ec2Instances, subnet)}
            />
          ))}
          <h3>Network ACLs</h3>
          {acls.map(acl => (
            <NetworkAcl key={acl.NetworkAclId} acl={acl} />
          ))}
          <h3>Route Tables</h3>
          {routeTables.map(routeTable => (
            <RouteTable
              key={routeTable.RouteTableId}
              routeTable={routeTable}
              vpcEndpoints={this.getRouteTableVpcEndpoints(
                vpcEndpoints,
                routeTable
              )}
            />
          ))}
          <h3>Internet Gateways</h3>
          {internetGateways.length > 0 ? (
            internetGateways.map(igw => (
              <InternetGateway
                key={igw.InternetGatewayId}
                internetGateway={igw}
              />
            ))
          ) : (
            <span>None.</span>
          )}
          <h3>RDS Instances</h3>
          {rdsInstances.length > 0 ? (
            rdsInstances.map(rdsInstance => (
              <RDSInstance
                key={rdsInstance.DbiResourceId}
                rdsInstance={rdsInstance}
              />
            ))
          ) : (
            <span>None.</span>
          )}
        </Panel>
      </div>
    );
  }
}

export default Vpc;
