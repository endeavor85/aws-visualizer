import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSRouteTableIcon from 'react-aws-icons/dist/aws/compute/RouteTable';

import styles from './RouteTable.css';

type Props = {
  vpcEndpoints: {
    VpcEndpointId: string
  }[],
  routeTable: {
    Tags: {
      Key: string,
      Value: string
    }[],
    RouteTableId: string,
    Routes: {
      DestinationPrefixListId?: string,
      DestinationCidrBlock?: string,
      GatewayId: string,
      Origin: string,
      State: string
    }[]
  }
};

class RouteTable extends Component<Props> {
  props: Props;

  getVpcEndpointGateway = (vpcEndpoints, gatewayId) =>
    vpcEndpoints.filter(
      vpcEndpoint => vpcEndpoint.VpcEndpointId === gatewayId
    )[0];

  render() {
    const { vpcEndpoints, routeTable } = this.props;

    const name = routeTable.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.RouteTable}>
        <Panel header={`${name} : ${routeTable.RouteTableId}`}>
          <AWSRouteTableIcon className="awsIcon" size={64} />
          <Table bordered condensed>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Gateway</th>
              </tr>
            </thead>
            <tbody>
              {routeTable.Routes.map(
                route =>
                  route.DestinationCidrBlock ? (
                    <tr key={route.DestinationCidrBlock}>
                      <td>{route.DestinationCidrBlock}</td>
                      <td>{route.GatewayId}</td>
                    </tr>
                  ) : (
                    <tr key={route.DestinationPrefixListId}>
                      <td />
                      <td>
                        {
                          this.getVpcEndpointGateway(
                            vpcEndpoints,
                            route.GatewayId
                          ).ServiceName
                        }
                        <br />({route.GatewayId})
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

export default RouteTable;
