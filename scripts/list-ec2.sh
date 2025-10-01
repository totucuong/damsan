#!/usr/bin/env bash
set -euo pipefail

aws ec2 describe-instances \
  --query "Reservations[].Instances[].{
      InstanceId: InstanceId,
      Name: Tags[?Key=='Name']|[0].Value,
      Type: InstanceType,
      State: State.Name,
      Zone: Placement.AvailabilityZone,
      PublicIP: PublicIpAddress,
      PrivateIP: PrivateIpAddress,
      LaunchTime: LaunchTime
    }" \
  --output table
