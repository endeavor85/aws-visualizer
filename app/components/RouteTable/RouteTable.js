import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AwsIcon from '../AwsIcon/AwsIcon';

import styles from './RouteTable.css';

class RouteTable extends Component {

  getVpcEndpointGateway = (gatewayId) => {
    return this.props.vpcEndpoints.filter((vpcEndpoint) => vpcEndpoint.VpcEndpointId === gatewayId)[0];
  }

  render() {
    const name = this.props.routeTable.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.RouteTable}>
        <Panel header={`${name} : ${this.props.routeTable.RouteTableId}`}>
          <AwsIcon src='Networking & Content Delivery/NetworkingContentDelivery_AmazonRoute53_routetable' />
          <Table bordered condensed>
            <thead>
              <tr><th>Destination</th><th>Gateway</th></tr>
            </thead>
            <tbody>
            {
              this.props.routeTable.Routes.map((route, i) => {
                return (
                  route.DestinationCidrBlock ? (
                      <tr key={i}>
                        <td>{route.DestinationCidrBlock}</td>
                        <td>{route.GatewayId}</td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <td></td>
                        <td>{this.getVpcEndpointGateway(route.GatewayId).ServiceName}<br/>({route.GatewayId})</td>
                      </tr>
                  )
                )
              })
            }
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

export default RouteTable;