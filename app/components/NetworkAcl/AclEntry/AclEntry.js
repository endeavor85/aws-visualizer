import React, { Component } from 'react';

import styles from './AclEntry.css';

const protocols = window.require('protocol-numbers');

type Props = {
  entry: {
    Protocol: string,
    PortRange: {
      From: number,
      To: number
    } | void,
    IcmpTypeCode: {
      Code: number,
      Type: number
    } | void,
    RuleAction: string,
    RuleNumber: number,
    CidrBlock: string
  }
};

class AclEntry extends Component<Props> {
  props: Props;

  render() {
    const { entry } = this.props;

    const protocol =
      entry.Protocol === '-1' ? 'ALL' : protocols[entry.Protocol].name;

    // ports
    let ports = '';

    // if port range is defined
    if (entry.PortRange) {
      ports = `${entry.PortRange.From}-${entry.PortRange.To}`;
    }
    // if protocol is ICMP
    else if (entry.Protocol === '1') {
      // https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
      ports = `${
        entry.IcmpTypeCode.Code < 0 ? 'ALL CODES' : entry.IcmpTypeCode.Code
      }, ${
        entry.IcmpTypeCode.Type < 0 ? 'ALL TYPES' : entry.IcmpTypeCode.Type
      }`;
    }

    return (
      <tr
        className={
          entry.RuleAction === 'deny'
            ? styles.AclEntryDeny
            : styles.AclEntryAllow
        }
      >
        <td>{entry.RuleNumber}</td>
        <td>{entry.RuleAction.toUpperCase()}</td>
        <td>{entry.CidrBlock}</td>
        <td>{protocol}</td>
        <td>{ports}</td>
      </tr>
    );
  }
}

export default AclEntry;
