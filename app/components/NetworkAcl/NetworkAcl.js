import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

import AclEntry from './AclEntry/AclEntry';

import styles from './NetworkAcl.css';

class NetworkAcl extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: props.acl.Tags.find(tag => tag.Key === 'Name').Value
    };
  }

  getIngressEntries = () => {
    return this.props.acl.Entries.filter((entry) => entry.Egress === false);
  }

  getEgressEntries = () => {
    return this.props.acl.Entries.filter((entry) => entry.Egress === true);
  }

  render() {
    return (
      <div className={styles.NetworkAcl}>
        <Panel header={`${this.state.name} : ${this.props.acl.NetworkAclId}`}>
            <Table bordered condensed>
                <thead>
                    <tr><th>#</th><th>Action</th><th>CIDR</th><th>Protocol</th><th>Port(s)</th></tr>
                </thead>
                <tbody>
                    <tr><th colSpan="5">Ingress</th></tr>
                    {
                        this.getIngressEntries().map(function(entry, i){
                            return <AclEntry key={i} entry={entry} />
                        })
                    }
                    <tr><th colSpan="5">Egress</th></tr>
                    {
                        this.getEgressEntries().map(function(entry, i){
                            return <AclEntry key={i} entry={entry} />
                        })
                    }
                </tbody>
            </Table>
        </Panel>
      </div>
    );
  }
}

export default NetworkAcl;