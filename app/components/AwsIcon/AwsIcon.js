import React, { Component } from 'react';

import styles from './AwsIcon.css';

const AWS_ICON_PATH = './assets/AWS_Simple_Icons/18.02.22';
const AWS_ICON_TYPE = '.png';

class AwsIcon extends Component {
  render() {
    const src = AWS_ICON_PATH + '/' + this.props.src + AWS_ICON_TYPE;

    return (
      <img className={styles.AwsIcon} src={src} alt={this.props.src} />
    );
  }
}

export default AwsIcon;