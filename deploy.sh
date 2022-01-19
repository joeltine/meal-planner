#!/usr/bin/env bash

ssh joel@192.168.1.211 << EOF
  cd /opt/meal-planner
  git pull
  ./mvnw clean package -DskipTests
  sudo systemctl restart meal-planner.service
EOF
