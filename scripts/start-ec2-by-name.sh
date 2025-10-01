#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <name-tag>" >&2
  exit 1
fi

NAME_TAG="$1"
INSTANCE_IDS=()

while IFS='' read -r instance_id; do
  [[ -n "$instance_id" ]] && INSTANCE_IDS+=("$instance_id")
done < <(
  aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=${NAME_TAG}" "Name=instance-state-name,Values=stopped" \
    --query "Reservations[].Instances[].InstanceId" \
    --output text
)

if (( ${#INSTANCE_IDS[@]} == 0 )); then
  echo "No stopped instances found with Name=${NAME_TAG}" >&2
  exit 1
fi

aws ec2 start-instances --instance-ids "${INSTANCE_IDS[@]}"
aws ec2 wait instance-running --instance-ids "${INSTANCE_IDS[@]}"

printf "Started instance(s): %s\n" "${INSTANCE_IDS[*]}"
