import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AclEntry from './AclEntry/AclEntry';

import styles from './NetworkAcl.css';

type Props = {
  acl: {
    NetworkAclId: string,
    Tags: {
      Key: string,
      Value: string
    }[],
    Entries: {
      RuleNumber: number,
      Egress: boolean
    }[]
  }
};

class NetworkAcl extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      name: props.acl.Tags.find(tag => tag.Key === 'Name').Value,
      ingressEntries: props.acl.Entries.filter(entry => entry.Egress === false),
      egressEntries: props.acl.Entries.filter(entry => entry.Egress === true)
    };
  }

  render() {
    const { acl } = this.props;

    const { name, ingressEntries, egressEntries } = this.state;

    return (
      <div className={styles.NetworkAcl}>
        <Panel header={`${name} : ${acl.NetworkAclId}`}>
          <Table bordered condensed>
            <thead>
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>CIDR</th>
                <th>Protocol</th>
                <th>Port(s)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="5">Ingress</th>
              </tr>
              {ingressEntries.map(entry => (
                <AclEntry key={entry.RuleNumber} entry={entry} />
              ))}
              <tr>
                <th colSpan="5">Egress</th>
              </tr>
              {egressEntries.map(entry => (
                <AclEntry key={entry.RuleNumber} entry={entry} />
              ))}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
}

export default NetworkAcl;
