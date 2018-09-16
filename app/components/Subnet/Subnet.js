import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import Ec2Instance from '../Ec2Instance/Ec2Instance';

import styles from './Subnet.css';

type Props = {
  subnet: {
    SubnetId: string,
    CidrBlock: string,
    AvailabilityZone: string,
    DefaultForAz: boolean,
    MapPublicIpOnLaunch: boolean,
    AvailableIpAddressCount: number,
    State: string,
    Tags: {
      Key: string,
      Value: string
    }[]
  },
  ec2Instances: {
    InstanceId: string
  }[]
};

class Subnet extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      name: props.subnet.Tags.find(tag => tag.Key === 'Name').Value
    };
  }

  render() {
    const { subnet, ec2Instances } = this.props;

    const { name } = this.state;

    return (
      <div className={styles.Subnet}>
        <Panel header={`Subnet ${name} : ${subnet.SubnetId}`}>
          <span className={styles.SubnetCidr}>{subnet.CidrBlock}</span>
          <Table bordered condensed>
            <tbody>
              <tr>
                <th>AZ</th>
                <td>{subnet.AvailabilityZone}</td>
              </tr>
              <tr>
                <th>Default for AZ</th>
                <td>{subnet.DefaultForAz.toString()}</td>
              </tr>
              <tr>
                <th>MapPublicIpOnLaunch</th>
                <td>{subnet.MapPublicIpOnLaunch.toString()}</td>
              </tr>
              <tr>
                <th>AvailableIpAddressCount</th>
                <td>{subnet.AvailableIpAddressCount}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{subnet.State}</td>
              </tr>
            </tbody>
          </Table>
          <h4>EC2 Instances</h4>
          {ec2Instances.length > 0 ? (
            ec2Instances.map(ec2Instance => (
              <Ec2Instance
                key={ec2Instance.InstanceId}
                ec2Instance={ec2Instance}
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

export default Subnet;
