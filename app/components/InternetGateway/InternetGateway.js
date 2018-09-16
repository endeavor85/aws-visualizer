import React, { Component } from 'react';
import { Thumbnail } from 'react-bootstrap';

import styles from './InternetGateway.css';

class InternetGateway extends Component {
  render() {
    const name = this.props.internetGateway.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.InternetGateway}>
        <Thumbnail src="./assets/AWS_Simple_Icons/18.02.22/Networking & Content Delivery/NetworkingContentDelivery_AmazonVPC_internetgateway.png" alt="Internet Gateway">
          <h4>{name}</h4>
          <p>{this.props.internetGateway.InternetGatewayId}</p>
        </Thumbnail>
      </div>
    );
  }
}

export default InternetGateway;