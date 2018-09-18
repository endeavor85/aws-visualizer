// const fs = require('fs');
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
            this.rds.describeDBClusters({}).promise(), // RDS Aurora Clusters
            this.rds.describeDBSubnetGroups({}).promise(), // RDS Subnet Groups
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

    static getNameTag(tags) {
        return tags.find(tag => tag.Key === "Name").Value;
    };

    static getACLEntryString(aclEntry) {
        return `${aclEntry.RuleNumber} ${aclEntry.RuleAction} ${aclEntry.Protocol} ${(aclEntry.PortRange ? (`${aclEntry.PortRange.From}-${aclEntry.PortRange.To}`) : "-")} ${aclEntry.CidrBlock}`;
    };

    static printAwsData(awsData) {
        // console.log("Reading cache file: " + config.cacheFile);

        try {
            // const awsData = jsonfile.readFileSync(config.cacheFile);

            // S3 Buckets

            console.log("=== S3 Buckets ===");
            awsData.Buckets.forEach((bucket) => {
                console.log(` - ${bucket.Name}`);
            });

            // RDS Instances

            console.log("=== RDS Instances ===");
            awsData.DBInstances.forEach((instance) => {
                console.log(` - ${instance.DBInstanceIdentifier}`);
                
                // VPC Security Groups
                console.log("    - VPC Security Groups:");
                instance.VpcSecurityGroups.forEach((vpcSecurityGroup) => {
                    console.log(`      - ${vpcSecurityGroup.VpcSecurityGroupId}`);
                });
                
                // DB Subnet Group
                console.log(`    - ${instance.DBSubnetGroup.DBSubnetGroupName}`);
                
                // DB Subnet Group Subnets
                console.log("      - Subnets:");
                instance.DBSubnetGroup.Subnets.forEach((subnet) => {
                    console.log(`        - ${subnet.SubnetIdentifier}`);
                });
            });

            // RDS Clusters

            console.log("=== RDS Aurora Clusters ===");
            awsData.DBClusters.forEach((cluster) => {
                console.log(` - ${cluster.DBClusterIdentifier}`);
                console.log(` - ${cluster.DatabaseName}`);
                console.log(` - ${cluster.Engine}`);
                console.log(` - ${cluster.Port}`);
                
                // VPC Security Groups
                console.log("    - VPC Security Groups:");
                cluster.VpcSecurityGroups.forEach((vpcSecurityGroup) => {
                    console.log(`      - ${vpcSecurityGroup.VpcSecurityGroupId}`);
                });
                
                // DB Subnet Group
                console.log(`    - ${cluster.DBSubnetGroupName}`);
            });

            // DB Subnet Groups

            console.log("=== DB Subnet Groups ===");
            awsData.DBSubnetGroups.forEach((dbSubnetGroup) => {
                console.log(` - ${dbSubnetGroup.DBSubnetGroupName}`);
                console.log(` - ${dbSubnetGroup.DBSubnetGroupDescription}`);
                console.log(` - ${dbSubnetGroup.VpcId}`);
                console.log(` - ${dbSubnetGroup.Port}`);
                
                // DB Subnet Group Subnets
                console.log("    - Subnets:");
                dbSubnetGroup.Subnets.forEach((subnet) => {
                    console.log(`      - ${subnet.SubnetIdentifier}(${subnet.SubnetAvailabilityZone.Name})`);
                });
            });

            // IAM Roles

            console.log("=== IAM Roles ===");
            awsData.Roles.forEach((role) => {
                console.log(` - ${role.RoleName}`);
            });

            // VPCs

            console.log("=== VPCs ===");
            awsData.Vpcs.forEach((vpc) => {
                console.log(` - ${AwsService.getNameTag(vpc.Tags)} (${vpc.VpcId})`);
                console.log(`   - ${vpc.CidrBlock}`);
            });

            // Subnets

            console.log("=== Subnets ===");
            awsData.Subnets.forEach((subnet) => {
                console.log(` - ${AwsService.getNameTag(subnet.Tags)} (${subnet.SubnetId}): ${subnet.CidrBlock}`);
            });

            // Elastic IPs

            console.log("=== Elastic IPs ===");
            awsData.Addresses.forEach((address) => {
                console.log(` - ${address.PublicIp} => ${(address.PrivateIpAddress ? address.PrivateIpAddress : "unassigned")}`);
            });

            // EC2 Instances

            console.log("=== EC2 Instances ===");
            awsData.Reservations.forEach((reservation) => {
                reservation.Instances.forEach((instance) => {
                    console.log(" - " + instance.InstanceId);
                    console.log("   - Security Groups:");
                    instance.SecurityGroups.forEach((sg) => {
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
            awsData.SecurityGroups.forEach((sg) => {
                console.log(" - " + sg.GroupName);
            });

            // Key Pairs

            console.log("=== Key Pairs ===");
            awsData.KeyPairs.forEach((keyPair) => {
                console.log(" - " + keyPair.KeyName);
            });
            
            // Internet Gateways

            console.log("=== Internet Gateways ===");
            awsData.InternetGateways.forEach((internetGateway) => {
                console.log(" - " + AwsService.getNameTag(internetGateway.Tags) + " (" + internetGateway.InternetGatewayId + ")");
            });
            
            // VPC Endpoints

            console.log("=== VPC Endpoints ===");
            awsData.VpcEndpoints.forEach((vpcEndpoint) => {
                console.log(" - " + vpcEndpoint.VpcEndpointId + " (" + vpcEndpoint.ServiceName + ")");
            });

            // Route Tables

            console.log("=== Route Tables ===");
            awsData.RouteTables.forEach((routeTable) => {
                console.log(" - " + AwsService.getNameTag(routeTable.Tags));

                console.log("    - VPC: " + routeTable.VpcId);

                console.log("    - Subnet Associations:");
                routeTable.Associations.forEach((subnet) => {
                    if(subnet.Main) {
                        console.log("      - (implicit)");
                    }
                    else {
                        console.log("      - " + subnet.SubnetId);
                    }
                });

                console.log("    - Routes:");
                routeTable.Routes.forEach((route) => {
                    console.log("      - " + route.DestinationCidrBlock  + " => " + route.GatewayId);
                });
            });

            // Network ACLs
            console.log("=== Network ACLs ===");
            awsData.NetworkAcls.forEach((acl) => {
                console.log(" - " + AwsService.getNameTag(acl.Tags));

                // Ingress Rules
                console.log("    - Ingress Rules:")
                acl.Entries.filter(entry => !entry.Egress).forEach((entry) => {
                    console.log("      - " + AwsService.getACLEntryString(entry));
                });
                console.log("    - Egress Rules:")
                acl.Entries.filter(entry => !entry.Egress).forEach((entry) => {
                    console.log("      - " + AwsService.getACLEntryString(entry));
                });
            });

        } catch (err) {
            console.error(err);
            throw err;
        }
    };
};