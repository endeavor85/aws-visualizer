// @flow
import React, { Component } from 'react';

import { Panel } from 'react-bootstrap';
import AWSCloudLogo from 'react-aws-icons/dist/aws/compute/AWSCloud';

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
    DBClusters: {
      DBClusterIdentifier: string,
      DBSubnetGroup: string
    }[],
    DBSubnetGroups: {
      DBSubnetGroupName: string,
      VpcId: string
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

  getVpcDbSubnetGroups = (dbSubnetGroups, vpc) =>
    dbSubnetGroups.filter(
      dbSubnetGroup => dbSubnetGroup.VpcId === vpc.VpcId
    );

  getRDSClusterDBSubnetGroup = (dbCluster, dbSubnetGroups) => 
    dbSubnetGroups.find(
      dbSubnetGroup => dbCluster.DBSubnetGroup === dbSubnetGroup.DBSubnetGroupName
    );

  getVpcRDSClusters = (dbClusters, dbSubnetGroups, vpc) => {
    const vpcDbSubnetGroupNames = this.getVpcDbSubnetGroups(dbSubnetGroups, vpc).map(dbSubnetGroup => dbSubnetGroup.DBSubnetGroupName);

    return dbClusters.filter(
      dbCluster => vpcDbSubnetGroupNames.includes(dbCluster.DBSubnetGroup)
    );
  }

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
        <Panel className={styles.AwsVisualizer} defaultExpanded>
          <Panel.Heading>
            <Panel.Toggle><AWSCloudLogo className="awsIcon" /></Panel.Toggle>
            AWS (Region: <span className="code">{awsRegion}</span>)
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              {awsData.Vpcs.map(vpc => (
                <Vpc
                  key={vpc.VpcId}
                  vpc={vpc}
                  subnets={this.getVpcSubnets(awsData.Subnets, vpc)}
                  acls={this.getVpcNetworkAcls(awsData.NetworkAcls, vpc)}
                  routeTables={this.getVpcRouteTables(awsData.RouteTables, vpc)}
                  ec2Instances={this.getVpcEc2Instances(awsData.Reservations, vpc)}
                  rdsInstances={this.getVpcRDSInstances(awsData.DBInstances, vpc)}
                  rdsClusters={this.getVpcRDSClusters(awsData.DBClusters, awsData.DBSubnetGroups, vpc)}
                  dbSubnetGroups={this.getVpcDbSubnetGroups(awsData.DBSubnetGroups, vpc)}
                  internetGateways={this.getVpcInternetGateways(awsData.InternetGateways, vpc)}
                  vpcEndpoints={this.getVpcVpcEndpoints(awsData.VpcEndpoints, vpc)}
                />
              ))}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}
