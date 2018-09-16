import React, { Component } from 'react';

import styles from './AclEntry.css';

const protocols = window.require('protocol-numbers');

class AclEntry extends Component {
  render() {

    const protocol = (this.props.entry.Protocol === "-1" ? "ALL" : protocols[this.props.entry.Protocol].name);

    // ports
    let ports = "";
    
    // if port range is defined
    if(this.props.entry.PortRange) {
      ports = this.props.entry.PortRange.From + "-" + this.props.entry.PortRange.To;
    }
    // if protocol is ICMP
    else if (this.props.entry.Protocol === "1"){
      // https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
      ports =
        (this.props.entry.IcmpTypeCode.Code < 0 ? "ALL CODES" : this.props.entry.IcmpTypeCode.Code) + ", " +
        (this.props.entry.IcmpTypeCode.Type < 0 ? "ALL TYPES" : this.props.entry.IcmpTypeCode.Type);
    }

    return (
      <tr className={this.props.entry.RuleAction === 'deny' ? styles.AclEntryDeny : styles.AclEntryAllow}>
        <td>{this.props.entry.RuleNumber}</td>
        <td>{this.props.entry.RuleAction.toUpperCase()}</td>
        <td>{this.props.entry.CidrBlock}</td>
        <td>{protocol}</td>
        <td>{ports}</td>
      </tr>
    );
  }
}

export default AclEntry;