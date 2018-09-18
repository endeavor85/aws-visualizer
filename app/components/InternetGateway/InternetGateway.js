import React, { Component } from 'react';

import AWSInternetGatewayIcon from 'react-aws-icons/dist/aws/compute/InternetGateway';

import styles from './InternetGateway.css';

type Props = {
  internetGateway: {
    InternetGatewayId: string,
    Tags: {
      Key: string,
      Value: string
    }[]
  }
};

class InternetGateway extends Component<Props> {
  props: Props;

  render() {
    const { internetGateway } = this.props;

    const name = internetGateway.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.InternetGateway}>
        <AWSInternetGatewayIcon className="awsIcon" size={64} />
        <div className="caption">
          <h4>Internet Gateway</h4>
          <h4>{name}</h4>
          <p>{internetGateway.InternetGatewayId}</p>
        </div>
      </div>
    );
  }
}

export default InternetGateway;
