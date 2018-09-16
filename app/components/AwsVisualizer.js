// @flow
import React, { Component } from 'react';

import { Panel } from 'react-bootstrap';
import AWSLogo from 'react-aws-icons/dist/aws/logo/AWS';

import Vpc from './Vpc/Vpc';

import styles from './AwsVisualizer.css';

type Props = {
  awsRegion: string,
  awsData: {
    Subnets: {
      VpcId: string
    }[],
    NetworkAcls: {
      VpcId: string
    }[],
    RouteTables: {
      VpcId: string
    }[],
    Reservations: {
      Instances: {
        VpcId: string
      }[]
    }[],
    VpcEndpoints: {
      VpcId: string
    }[],
    DBInstances: {
      DBSubnetGroup: {
        VpcId: string
      }
    }[],
    InternetGateways: {
      Attachments: {
        VpcId: string
      }[]
    }[]
  }
};

export default class AwsVisualizer extends Component<Props> {
  props: Props;

  getVpcSubnets = (subnets, vpc) =>
    subnets.filter(subnet => subnet.VpcId === vpc.VpcId);

  getVpcNetworkAcls = (acls, vpc) =>
    acls.filter(acl => acl.VpcId === vpc.VpcId);

  getVpcRouteTables = (routeTables, vpc) =>
    routeTables.filter(routeTable => routeTable.VpcId === vpc.VpcId);

  getVpcEc2Instances = (reservations, vpc) =>
    []
      .concat(...reservations.map(reservation => reservation.Instances))
      .filter(instance => instance.VpcId === vpc.VpcId);

  getVpcVpcEndpoints = (vpcEndpoints, vpc) =>
    vpcEndpoints.filter(vpcEndpoint => vpcEndpoint.VpcId === vpc.VpcId);

  getVpcRDSInstances = (dbInstances, vpc) =>
    dbInstances.filter(
      rdsInstance => rdsInstance.DBSubnetGroup.VpcId === vpc.VpcId
    );

  getVpcInternetGateways = (igws, vpc) =>
    igws.filter(
      igw =>
        igw.Attachments.filter(attachment => attachment.VpcId === vpc.VpcId)
          .length > 0
    );

  render() {
    const { awsData, awsRegion } = this.props;

    return (
      <div className={styles.container} data-tid="container">
        <h2>AWS Visualizer</h2>
        <Panel
          className={styles.AwsPanel}
          header={`AWS (Region: ${awsRegion})`}
        >
          <AWSLogo className="awsIcon" size={64} />
          <h2>VPCs</h2>
          {awsData.Vpcs.map(vpc => (
            <Vpc
              key={vpc.VpcId}
              vpc={vpc}
              subnets={this.getVpcSubnets(awsData.Subnets, vpc)}
              acls={this.getVpcNetworkAcls(awsData.NetworkAcls, vpc)}
              routeTables={this.getVpcRouteTables(awsData.RouteTables, vpc)}
              ec2Instances={this.getVpcEc2Instances(awsData.Reservations, vpc)}
              rdsInstances={this.getVpcRDSInstances(awsData.DBInstances, vpc)}
              internetGateways={this.getVpcInternetGateways(
                awsData.InternetGateways,
                vpc
              )}
              vpcEndpoints={this.getVpcVpcEndpoints(awsData.VpcEndpoints, vpc)}
            />
          ))}
        </Panel>
      </div>
    );
  }
}
