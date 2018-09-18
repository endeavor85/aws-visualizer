import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AWSInstanceIcon from 'react-aws-icons/dist/aws/compute/Instance';
import AWSElasticIPAddressIcon from 'react-aws-icons/dist/aws/compute/ElasticIPAddress';

import styles from './Ec2Instance.css';

type Props = {
  ec2Instance: {
    InstanceId: string,
    Placement: {
      AvailabilityZone: string
    },
    InstanceType: string,
    Architecture: string,
    State: {
      Name: string
    },
    LaunchTime: string,
    PublicIpAddress: string | void,
    PublicDnsName: string,
    PrivateIpAddress: string,
    PrivateDnsName: string,
    KeyName: string | void,
    IamInstanceProfile?: {
      Arn: string
    },
    ImageId: string,
    Tags: {
      Key: string,
      Value: string
    }[]
  }
};

class Ec2Instance extends Component<Props> {
  props: Props;

  render() {
    const { ec2Instance } = this.props;

    const name = ec2Instance.Tags.find(tag => tag.Key === 'Name').Value;

    return (
      <div className={styles.Ec2Instance}>
        <Panel>
          <Panel.Heading>
            <Panel.Toggle>
              <AWSInstanceIcon className="awsIcon" />
            </Panel.Toggle>
            Ec2 Instance {name} : <span className="code">{ec2Instance.InstanceId}</span>
          </Panel.Heading>
          <Panel.Collapse>
            <Table bordered condensed>
              <tbody>
                <tr>
                  <th>AZ</th>
                  <td>{ec2Instance.Placement.AvailabilityZone}</td>
                </tr>
                <tr>
                  <th>Instance Type</th>
                  <td>{ec2Instance.InstanceType}</td>
                </tr>
                <tr>
                  <th>Architecture</th>
                  <td>{ec2Instance.Architecture}</td>
                </tr>
                <tr>
                  <th>State</th>
                  <td>{ec2Instance.State.Name}</td>
                </tr>
                <tr>
                  <th>Launch Time</th>
                  <td>{ec2Instance.LaunchTime}</td>
                </tr>
                <tr>
                  <th>Public IP</th>
                  {ec2Instance.PublicIpAddress ? (
                    <td>
                      <AWSElasticIPAddressIcon className={`awsIcon ${styles.elasticIpIcon}`} />
                      &nbsp;&nbsp;
                      {ec2Instance.PublicIpAddress}
                    </td>
                  ) : (
                    <td />
                  )}
                </tr>
                <tr>
                  <th>Public DNS Name</th>
                  <td>{ec2Instance.PublicDnsName}</td>
                </tr>
                <tr>
                  <th>Private IP</th>
                  <td>{ec2Instance.PrivateIpAddress}</td>
                </tr>
                <tr>
                  <th>Private DNS Name</th>
                  <td>{ec2Instance.PrivateDnsName}</td>
                </tr>
                <tr>
                  <th>Key Name</th>
                  <td>{ec2Instance.KeyName}</td>
                </tr>
                <tr>
                  <th>IAM Instance Profile</th>
                  {
                    ec2Instance.IamInstanceProfile ? (
                      <td>{ec2Instance.IamInstanceProfile.Arn}</td>
                    ) : (
                      <td />
                    )
                  }
                </tr>
                <tr>
                  <th>Image Id</th>
                  <td>{ec2Instance.ImageId}</td>
                </tr>
              </tbody>
            </Table>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}

export default Ec2Instance;
