const fs = require('fs');
const AWS = require('aws-sdk');
// const jsonfile = require('jsonfile');

module.exports = class AwsService {
    constructor(awsProfile, awsRegion) {

        process.env.AWS_PROFILE = awsProfile;

        this.awsRegion = awsRegion || 'us-east-1';

        // AWS SDK Configuration
        AWS.config.update({
            region: this.awsRegion
        });

        // initialize AWS SDK service objects
        this.s3 = new AWS.S3();
        this.rds = new AWS.RDS();
        this.iam = new AWS.IAM();
        this.ec2 = new AWS.EC2();
    }

    // ============================================================================

    // writeToCache(cacheObj) {
    //     const config = require('./config.js');

    //     // create tmpDir directory if it doesn't exist
    //     if (!fs.existsSync(config.tmpDir)){
    //         fs.mkdirSync(config.tmpDir);
    //     }

    //     console.log("Writing cache file: " + config.cacheFile);

    //     try {
    //         jsonfile.writeFileSync(config.cacheFile, cacheObj, {spaces: 2});
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // ============================================================================

    load() {
        return Promise.all([
            this.s3.listBuckets({}).promise(), // S3 Buckets
            this.rds.describeDBInstances({}).promise(), // RDS Instances
            this.iam.listRoles({}).promise(), // IAM Roles
            this.ec2.describeVpcs({}).promise(), // VPCs
            this.ec2.describeSubnets({}).promise(), // Subnets
            this.ec2.describeAddresses({}).promise(), // Elastic IPs
            this.ec2.describeInstances({}).promise(), // EC2 Instances
            this.ec2.describeKeyPairs({}).promise(), // Key Pairs
            this.ec2.describeSecurityGroups({}).promise(), // Security Groups
            this.ec2.describeInternetGateways({}).promise(), // Internet Gateways
            this.ec2.describeRouteTables({}).promise(), // Route Tables
            this.ec2.describeNetworkAcls({}).promise(), // Network ACLs
            this.ec2.describeVpcEndpoints({}).promise() // VPC Endpoints
        ]).then(values => {
            
            // merge all responses into a single data object
            const data = {};
            values.forEach(value => {
                Object.assign(data, value);
            });
            data.AwsRegion = this.awsRegion;

            // write data to cache file
            // writeToCache(data);
    
            // print the cache contents (formatted)
            // printCache();
            
            return data;
        });
    };

    getNameTag(tags) {
        return tags.find(tag => tag.Key === "Name").Value;
    };

    printAwsData(awsData) {
        console.log("Reading cache file: " + config.cacheFile);

        try {
            // const awsData = jsonfile.readFileSync(config.cacheFile);

            // S3 Buckets

            console.log("=== S3 Buckets ===");
            awsData.Buckets.forEach(function(bucket) {
                console.log(" - " + bucket.Name);
            });

            // RDS Instances

            console.log("=== RDS Instances ===");
            awsData.DBInstances.forEach(function(instance) {
                console.log(" - " + instance.DBInstanceIdentifier);
                
                // VPC Security Groups
                console.log("    - " + "VPC Security Groups:");
                instance.VpcSecurityGroups.forEach(function(vpcSecurityGroup) {
                    console.log("      - " + vpcSecurityGroup.VpcSecurityGroupId);
                });
                
                // DB Subnet Group
                console.log("    - " + instance.DBSubnetGroup.DBSubnetGroupName);
                
                // DB Subnet Group Subnets
                console.log("      - " + "Subnets:");
                instance.DBSubnetGroup.Subnets.forEach(function(subnet) {
                    console.log("        - " + subnet.SubnetIdentifier);
                });
            });

            // IAM Roles

            console.log("=== IAM Roles ===");
            awsData.Roles.forEach(function(role) {
                console.log(" - " + role.RoleName);
            });

            // VPCs

            console.log("=== VPCs ===");
            awsData.Vpcs.forEach(function(vpc) {
                console.log(" - " + getNameTag(vpc.Tags) + " (" + vpc.VpcId + ")");
                console.log("   - " + vpc.CidrBlock);
            });

            // Subnets

            console.log("=== Subnets ===");
            awsData.Subnets.forEach(function(subnet) {
                console.log(" - " + getNameTag(subnet.Tags) + " (" + subnet.SubnetId + "): " + subnet.CidrBlock);
            });

            // Elastic IPs

            console.log("=== Elastic IPs ===");
            awsData.Addresses.forEach(function(address) {
                console.log(" - " + address.PublicIp + " => " + (address.PrivateIpAddress ? address.PrivateIpAddress : "unassigned"));
            });

            // EC2 Instances

            console.log("=== EC2 Instances ===");
            awsData.Reservations.forEach(function(reservation) {
                reservation.Instances.forEach(function(instance) {
                    console.log(" - " + instance.InstanceId);
                    console.log("   - Security Groups:");
                    instance.SecurityGroups.forEach(function(sg) {
                        console.log("      - " + sg.GroupName);
                    });
                    console.log("   - IAM Instance Profile: " + instance.IamInstanceProfile.Id);
                    console.log("   - Type: " + instance.InstanceType);
                    console.log("   - Key: " + instance.KeyName);
                    console.log("   - Private IP: " + instance.PrivateIpAddress);
                    console.log("   - Public IP: " + instance.PublicIpAddress);
                    console.log("   - VPC: " + instance.VpcId);
                    console.log("   - Subnet: " + instance.SubnetId);
                });
            });

            // security Groups

            console.log("=== Security Groups ===");
            awsData.SecurityGroups.forEach(function(sg) {
                console.log(" - " + sg.GroupName);
            });

            // Key Pairs

            console.log("=== Key Pairs ===");
            awsData.KeyPairs.forEach(function(keyPair) {
                console.log(" - " + keyPair.KeyName);
            });
            
            // Internet Gateways

            console.log("=== Internet Gateways ===");
            awsData.InternetGateways.forEach(function(internetGateway) {
                console.log(" - " + getNameTag(internetGateway.Tags) + " (" + internetGateway.InternetGatewayId + ")");
            });
            
            // VPC Endpoints

            console.log("=== VPC Endpoints ===");
            awsData.VpcEndpoints.forEach(function(vpcEndpoint) {
                console.log(" - " + vpcEndpoint.VpcEndpointId + " (" + vpcEndpoint.ServiceName + ")");
            });

            // Route Tables

            console.log("=== Route Tables ===");
            awsData.RouteTables.forEach(function(routeTable) {
                console.log(" - " + getNameTag(routeTable.Tags));

                console.log("    - VPC: " + routeTable.VpcId);

                console.log("    - Subnet Associations:");
                routeTable.Associations.forEach(function(subnet){
                    if(subnet.Main) {
                        console.log("      - (implicit)");
                    }
                    else {
                        console.log("      - " + subnet.SubnetId);
                    }
                });

                console.log("    - Routes:");
                routeTable.Routes.forEach(function(route){
                    console.log("      - " + route.DestinationCidrBlock  + " => " + route.GatewayId);
                });
            });

            // Network ACLs
            console.log("=== Network ACLs ===");
            awsData.NetworkAcls.forEach(function(acl) {
                console.log(" - " + getNameTag(acl.Tags));

                // Ingress Rules
                const ingressRules = acl.Entries;
                console.log("    - Ingress Rules:")
                acl.Entries.filter(entry => !entry.Egress).forEach(function(entry) {
                    console.log("      - " + getACLEntryString(entry));
                });
                console.log("    - Egress Rules:")
                acl.Entries.filter(entry => !entry.Egress).forEach(function(entry) {
                    console.log("      - " + getACLEntryString(entry));
                });
            });

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getACLEntryString(aclEntry) {
        return aclEntry.RuleNumber + " " + aclEntry.RuleAction + " " + aclEntry.Protocol + " " + (aclEntry.PortRange ? (aclEntry.PortRange.From + "-" + aclEntry.PortRange.To) : "-") + " " + aclEntry.CidrBlock;
    };
};