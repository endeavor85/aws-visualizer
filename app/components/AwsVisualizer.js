// @flow
import React, { Component } from 'react';

import { Panel } from 'react-bootstrap';
import Vpc from './Vpc/Vpc';
import AwsIcon from './AwsIcon/AwsIcon';

import styles from './AwsVisualizer.css';

type Props = {
  awsRegion: string,
  awsData: any
};

export default class AwsVisualizer extends Component<Props> {
  props: Props;
  
  getVpcSubnets = (vpc) => {
    return this.props.awsData.Subnets.filter((subnet) => subnet.VpcId === vpc.VpcId);
  }

  getVpcNetworkAcls = (vpc) => {
    return this.props.awsData.NetworkAcls.filter((acl) => acl.VpcId === vpc.VpcId);
  }

  getVpcRouteTables = (vpc) => {
    return this.props.awsData.RouteTables.filter((routeTable) => routeTable.VpcId === vpc.VpcId);
  }

  getVpcEc2Instances = (vpc) => {
    return [].concat.apply([], this.props.awsData.Reservations.map((reservation) => reservation.Instances))
      .filter((instance) => instance.VpcId === vpc.VpcId);
  }
  
  getVpcVpcEndpoints = (vpc) => {
    return this.props.awsData.VpcEndpoints.filter((vpcEndpoint) => vpcEndpoint.VpcId === vpc.VpcId);
  }
  
  getVpcRDSInstances = (vpc) => {
    return this.props.awsData.DBInstances.filter((rdsInstance) => rdsInstance.DBSubnetGroup.VpcId === vpc.VpcId);
  }

  getVpcInternetGateways = (vpc) => {
    return this.props.awsData.InternetGateways.filter((igw) => {
      return (igw.Attachments.filter((attachment) => attachment.VpcId === vpc.VpcId).length > 0)
    });
  }

  render() {
    const {
      awsData,
      awsRegion
    } = this.props;

    return (
      <div className={styles.container} data-tid="container">
        <h2>AWS Visualizer</h2>
        <Panel className={styles.AwsPanel} header={`AWS (Region: ${this.props.awsRegion})`}>
          <AwsIcon src='General/General_AWScloud' />
          <h2>VPCs</h2>
          {
            this.props.awsData.Vpcs.map((vpc, i) => {
              return <Vpc key={i}
                vpc={vpc}
                subnets={this.getVpcSubnets(vpc)}
                acls={this.getVpcNetworkAcls(vpc)}
                routeTables={this.getVpcRouteTables(vpc)}
                ec2Instances={this.getVpcEc2Instances(vpc)}
                rdsInstances={this.getVpcRDSInstances(vpc)}
                internetGateways={this.getVpcInternetGateways(vpc)}
                vpcEndpoints={this.getVpcVpcEndpoints(vpc)}
                />
            })
          }
        </Panel>
      </div>
    );
  }
}
