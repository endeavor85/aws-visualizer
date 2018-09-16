import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

import Subnet from '../Subnet/Subnet';
import NetworkAcl from '../NetworkAcl/NetworkAcl';
import RouteTable from '../RouteTable/RouteTable';
import RDSInstance from '../RDSInstance/RDSInstance';
import InternetGateway from '../InternetGateway/InternetGateway';
import AwsIcon from '../AwsIcon/AwsIcon';

import styles from './Vpc.css';

class Vpc extends Component {
  getSubnetEc2Instances = (subnet) => {
    return this.props.ec2Instances.filter((instance) => instance.SubnetId === subnet.SubnetId);
  }
  
  getRouteTableVpcEndpoints = (routeTable) => {
    return this.props.vpcEndpoints.filter((vpcEndpoint) => {
      return (vpcEndpoint.RouteTableIds.filter((routeTableId) => routeTableId === routeTable.RouteTableId).length > 0)
    });
  }

  render() {
    const name = this.props.vpc.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.Vpc}>
        <Panel header={`VPC ${name} : ${this.props.vpc.VpcId}`}>
          <AwsIcon src='General/General_virtualprivatecloud' />
          <span className={styles.VpcCidr}>{this.props.vpc.CidrBlock}</span>
          <h3>Subnets</h3>
          {
            this.props.subnets.map((subnet, i) => {
              return <Subnet key={i} subnet={subnet} ec2Instances={this.getSubnetEc2Instances(subnet)} />
            })
          }
          <h3>Network ACLs</h3>
          {
            this.props.acls.map((acl, i) => {
              return <NetworkAcl key={i} acl={acl} />
            })
          }
          <h3>Route Tables</h3>
          {
            this.props.routeTables.map((routeTable, i) => {
              return <RouteTable key={i} routeTable={routeTable} vpcEndpoints={this.getRouteTableVpcEndpoints(routeTable)} />
            })
          }
          <h3>Internet Gateways</h3>
          {
            this.props.internetGateways.length > 0 ? (
              this.props.internetGateways.map((igw, i) => {
                return <InternetGateway key={i} internetGateway={igw} />
              })
            ) : (
              <span>None.</span>
            )
          }
          <h3>RDS Instances</h3>
          {
            this.props.rdsInstances.length > 0 ? (
              this.props.rdsInstances.map((rdsInstance, i) => {
                return <RDSInstance key={i} rdsInstance={rdsInstance} />
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

export default Vpc;